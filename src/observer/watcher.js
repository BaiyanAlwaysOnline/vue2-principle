import { nextTick } from "../utils/util";
import { popDep, pushDep } from "./dep";

// watcher类
let id = 0;
class Watcher{
    constructor(vm, exprOrFunc, cb, options) {
        this.vm = vm;
        this.exprOrFunc = exprOrFunc;
        this.cb = cb;
        this.options = options;
        this.user = !!options.user; // 是否是用户的watcher
        this.lazy = !!options.lazy; // 计算属性watcher的标识，不可变
        this.dirty = this.lazy; // 计算属性watcher 缓存使用；
        this.id = id++; // 每一个watcher都是唯一的
        this.deps = [];
        this.depsId = new Set();
        if (typeof exprOrFunc === 'function') {
            this.getter = exprOrFunc
        }else {
            // 可能是个字符串，说明是用户watcher，当在当前实例上取值时，才触发收集依赖
            this.getter = function() {
                 let obj = vm;
                 for (let i = 0, path = exprOrFunc.split('.'); i < path.length; i ++) {
                    obj = obj[path[i]]
                 };
                 return obj
            }
        }
        this.value = this.lazy ? void 0 : this.get();
    }
    // 依赖收集
    get() {
        // 利用js是单线程的，当render执行的时候，触发响应式对象的get，将依赖收集
        pushDep(this);
        const val = this.getter.call(this.vm, this.vm);
        // 移除当前依赖 因为是渲染watcher，防止用户在代码里面 console.log(this.xx)的时候，触发watcher
        popDep();
        return val;
    }
    update() {
        // 这里不能每次都调用get方法，get方法会重新渲染页面
        // 计算属性，只需要重置dirty的值
        if (this.lazy) {
            this.dirty = true;
        }else{
            queueWatcher(this);
        }
    }
    run() {
        const oldValue = this.value;
        const newValue = this.value = this.get();
        if (this.user) {
            this.cb(oldValue, newValue);
        }
    }

    addDepend(dep) {
        const id = dep.id;
        if (!this.depsId.has(id)) {
            this.deps.push(dep);
            this.depsId.add(id);
            dep.addSub(this);
        }
    }

    evaluate() {
        // 依赖收集，执行回调
        this.value = this.get();
        // 表示已经更新
        this.dirty = false;
    }

    depend() {
        // 
        let i = this.deps.length;
        while (i--) {
            this.deps[i].depend();
        }
    }
}

let queue = [];
let pending = false;
let has = {};

function flushSchedulerQueue() {
    queue.forEach((watcher) => {
        watcher.run();
        if (!watcher.user) watcher.cb();
    });
    queue = [];
    has = {};
    pending = false;
}


// watcher 批处理
function queueWatcher(watcher) {
    const id = watcher.id;
    if (!has[id]) {
        queue.push(watcher);
        has[id] = true;
        if (!pending) {
            nextTick(flushSchedulerQueue);
            pending = true;
        }
    }
}

export default Watcher;
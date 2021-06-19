import { nextTick } from "../utils/util";
import { popDep, pushDep } from "./dep";

// watcher类
let id = 0;
class Watcher{
    constructor(vm, expFunction, cb, options) {
        this.vm = vm;
        this.expFunction = expFunction;
        this.cb = cb;
        this.options = options;
        this.id = id++; // 每一个watcher都是唯一的
        this.deps = [];
        this.depsId = new Set();
        if (typeof expFunction === 'function') {
            this.getter = expFunction
        }
        this.get();
    }
    get() {
        // 利用js是单线程的，当render执行的时候，触发响应式对象的get，将依赖收集
        pushDep(this);
        this.getter();
        // 移除当前依赖 因为是渲染watcher，防止用户在代码里面 console.log(this.xx)的时候，触发watcher
        popDep();
    }
    update() {
        // 这里不能每次都调用get方法，get方法会重新渲染页面
        // this.get();
        queueWatcher(this);
    }
    run() {
        this.get();
    }

    addDepend(dep) {
        const id = dep.id;
        if (!this.depsId.has(id)) {
            this.deps.push(dep);
            this.depsId.add(id);
            dep.addSub(this);
        }
    }
}

let queue = [];
let pending = false;
let has = {};

function flushSchedulerQueue() {
    queue.forEach((watcher) => {watcher.run(); watcher.cb()});
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
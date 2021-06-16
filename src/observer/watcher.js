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

export default Watcher  ;
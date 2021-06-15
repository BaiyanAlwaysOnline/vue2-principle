// 依赖收集类

class Dep{
    constructor() {
        this.subscribe = [];
    }
    depend() {
        this.subscribe.push(Dep.target);
    }
    notify() {
        this.subscribe.forEach(watcher => watcher.update());
    }
}

Dep.target = null;  // 静态属性 唯一

export function pushDep(watcher) {
    Dep.target = watcher;
}

export function popDep() {
    Dep.target = null;
}

export default Dep;
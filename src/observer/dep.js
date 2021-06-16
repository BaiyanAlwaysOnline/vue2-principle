// 依赖收集类
let id = 0;
class Dep{
    constructor() {
        this.subscribe = [];
        this.id = id++;
    }
    depend() {
        // dep和watcher是多对多的关系，让dep和watcher互相记忆
        // computed需要用到
        Dep.target.addDepend(this);
    }
    notify() {
        this.subscribe.forEach(watcher => watcher.update());
    }
    addSub(watcher) {
        this.subscribe.push(watcher);
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
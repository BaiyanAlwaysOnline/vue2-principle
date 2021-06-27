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
const stack = []; // 使用栈记录所有watcher

export function pushDep(watcher) {
    Dep.target = watcher;
    stack.push(watcher);
}

export function popDep() {
    stack.pop();
    Dep.target = stack[stack.length - 1];
}

export default Dep;
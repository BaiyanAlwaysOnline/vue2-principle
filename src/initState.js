import { observe } from "./observer/index.js";
import Watcher from "./observer/watcher.js";
import proxy from "./utils/proxy.js";
import { nextTick } from "./utils/util.js";


export function initState(vm) {
    const opts = vm.$options;
    if (opts.props) initProps(vm);
    if (opts.data) initData(vm);
    if (opts.watch) initWatch(vm);
    if (opts.computed) initComputed(vm);
    if (opts.methods) initMethods(vm);
}

// 数据的初始化操作
function initData(vm) {
    let data = vm.$options.data;
    vm._data = data = typeof data === 'function' ? data.call(vm) : data;
    // 数据劫持
    // 对象: Object.defineProperty
    // 只观测data里面有的属性  如果使用vm.c = 3，观测不到； vm.$set
    // 数组中更改索引和长度，无法被监控
    observe(data);
    // 用户通过vm._data使用起来非常麻烦，优化：
    for (let k in data) {
        proxy(vm, '_data', k);
    }
}
function initProps(vm) {}
function initWatch(vm) {
    // watch有三种写法
    // 1. k: v
    // 2. 'k.k.k'
    // 3. k: [method1, method2]
    // 4. k: 当前实例上的方法
    // 5. k: {handler: () => {}}
    const watch = vm.$options.watch;
    for (let k in watch) {
        const handler = watch[k];
        if (Array.isArray(handler)) {
            handler.forEach(handle => createWatcher(vm, k, handle))
        }else {
            createWatcher(vm, k, handler);
        }
    }
}
function initComputed(vm) {}
function initMethods(vm) {}

function createWatcher(vm, exprOrFunc, handler, options) {
    if (typeof handler === 'object') {
        options = handler;
        handler = options.handler;
    }
    // handler为当前实例上的方法
    if (typeof handler === 'string') {
        handler = vm[handler];
    }
    return vm.$watch(exprOrFunc, handler, options);
}


export function stateMixin(Vue) {
    Vue.prototype.$nextTick = function(cb) {
        nextTick(cb)
    }
    Vue.prototype.$watch = function(exprOrFunc, cb, options) {
        new Watcher(this, exprOrFunc, cb, {...options, user: true});
        if (options?.immediate) {
            cb();
        }
    }
}
import { observe } from "./observer/index.js";


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
    observe(data);
}
function initProps(vm) {}
function initWatch(vm) {}
function initComputed(vm) {}
function initMethods(vm) {}
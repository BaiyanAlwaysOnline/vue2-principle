import { observe } from "./observer/index.js";
import proxy from "./utils/proxy.js";


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
function initWatch(vm) {}
function initComputed(vm) {}
function initMethods(vm) {}
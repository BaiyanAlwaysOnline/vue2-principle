/**
 * @description 组件生命周期
 */
import { patch } from "./vnode/patch";
import Watcher from "./observer/watcher.js";

export function lifecycleMixin(Vue) {
    Vue.prototype._update = function(vnode) {
        const vm = this;
        vm.$el = patch(vm.$el, vnode);
    }
}

export function mountComponent(vm) {
    callHook(vm, 'beforeMount')
    // 1.调用render方法创建虚拟节点；
    // 2.将虚拟节点渲染到el上 
    // 3.Vue更新策略是以组件为单位的，给每一个组件增加watcher，属性变化后会重新调用这个watcher（渲染watcher）
    // 这个watcher其实就是 vm._update(vm._render()) 的封装；
    function updateComponent() {
        vm._update(vm._render());
    }
    // 渲染watcher,初始化就会执行
    const watcher = new Watcher(vm, updateComponent, () => callHook(vm, 'updated'), {
        user: false,
    });
    callHook(vm, 'mounted')
}

export function callHook(vm, hook) {
    const handlers = vm.$options[hook] || [];
    for (let i = 0; i < handlers.length; i ++) {
        handlers[i].call(vm);
    }
}
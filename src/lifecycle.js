/**
 * @description 组件生命周期
 */
import { patch } from "./vnode/patch";

export function lifecycleMixin(Vue) {
    Vue.prototype._update = function(vnode) {
        const vm = this;
        patch(vm.$el, vnode);
    }
}

export function mountComponent(vm, el) {
    callHook(vm, 'beforeMount')
    // 1.调用render方法创建虚拟节点；
    const vnode = vm._render();
    // 2.将虚拟节点渲染到el上 
    vm._update(vnode);
    callHook(vm, 'mounted')
}

export function callHook(vm, hook) {
    const handlers = vm.$options[hook] || [];
    for (let i = 0; i < handlers.length; i ++) {
        handlers[i].call(vm);
    }
}
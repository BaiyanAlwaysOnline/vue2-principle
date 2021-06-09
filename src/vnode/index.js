export function renderMixin(Vue) {
    // 创建虚拟dom节点；
    Vue.prototype._c = function() {
        return createElement(...arguments);
    }
    // 创建虚拟dom文本元素
    Vue.prototype._v = function(text) {
        return createTextVNode(text);
    }
    // stringify {{value}}
    Vue.prototype._s = function(val) {
        return val == null ? '' : (typeof val == 'object') ? JSON.stringify(val) : val;
    }
    Vue.prototype._render = function() {
        const vm = this;
        const render = vm.$options.render;
        return render.call(vm);
    }
}

function createElement(tag, data = {}, ...children) {
    return vnode(tag, data, data?.key, children)
}

function createTextVNode(text) {
    return vnode(undefined, undefined, undefined, undefined, text)
}
// 创建虚拟dom
function vnode(tag, data, key, children, text) {
    return {
        tag, data, key, children, text
    }
}
import { isReservedTag } from "../utils/util";

export function renderMixin(Vue) {
    // 创建虚拟dom节点；
    Vue.prototype._c = function() {
        return createElement.apply(this, arguments);
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
    // 根据tag的名字
    if (isReservedTag(tag)) {
        // 可能是原生dom
        return vnode(tag, data, data?.key, children)
    }else {
        // 可能是Vue组件，产生虚拟节点时需要把组件的构造函数传入，new Ctor().$mount();
        const Ctor = this.$options.components[tag]
        return createComponent(this, tag, data, data?.key, children, Ctor);  // 这里的children就是插槽了
    }
}

function createComponent(vm, tag, data, key, children, Ctor) {
    const baseCtor = vm.$options._base;
    // 这里Ctor可能是一个Objec,也可能是一个构造函数
    // 抹平差异
    if (typeof Ctor === 'object') {
        Ctor = baseCtor.extend(Ctor);
    }
    // 给组件增加生命周期； 
    data.hook = {  // 初始化组件时，会调用此方法
        init(vnode) {
            let child = vnode.componentInstance = new Ctor({});
            child.$mount(); // 组件的$mount是不传参数的
        }
    };

    // 给devTool插件用的
    const component = vnode(`vue-component-${Ctor.cid}-${tag}`, data, data?.key, undefined, undefined, {
        Ctor, 
        children,
    })
    return component;
}

function createTextVNode(text) {
    return vnode(undefined, undefined, undefined, undefined, text)
}
// 创建虚拟dom，操作真实Dom浪费性能
function vnode(tag, data, key, children, text, componentOptions) {
    return {
        tag, data, key, children, text, componentOptions // ! 组件多一个componentOptions属性，保存当前组件的构造函数以及他的插槽
    }
}
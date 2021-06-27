import { compileToFuncs } from "./compiler/index.js";
import { initState } from "./initState";
import { callHook, mountComponent } from "./lifecycle.js";
import { mergeOptions } from "./utils/util.js";

export default function initMixin(Vue) {
    Vue.prototype._init = function(options) {
        const vm = this;
        // 每次new的时候都把全局的options合并到当前实例上 
        //合并 有可能是子组件 通过vm.constructor指向自己的构造函数
        vm.$options = mergeOptions(vm.constructor.options, options)
        // 初始化的功能拓展
        // 1.初始化状态（将数据做一个初始化的劫持， 改变数据，更新视图）
        // vue组件中有很多属性 data props watch computed
        callHook(vm, 'beforeCreate');
        initState(vm);
        callHook(vm, 'created');
        if (vm.$options.el) {
            this.$mount(vm.$options.el);
        }
    }

    Vue.prototype.$mount = function(el) {
        // 2.渲染操作：
        // 1>.默认找render
        // 2>.没有render找template => 通过ast => render
        // 3>.找到当前el指定的元素中的内容来进行渲染
        const vm = this;
        const $el = document.querySelector(el);
        vm.$el = $el;
        let { template, render } = vm.$options;
        if (!render) {
            if (!template && $el) {
                template = $el.outerHTML;
            }
            vm.$options.render = compileToFuncs(template);
        }
        // console.log(vm.$options.render);

        // 挂载这个组件
        mountComponent(vm);
    }
}
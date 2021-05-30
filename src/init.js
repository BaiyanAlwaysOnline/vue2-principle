import { initState } from "./initState";

export default function initMixin(Vue) {
    Vue.prototype._init = function(options) {
        const vm = this;
        vm.$options = options;
        // 初始化的功能拓展
        // 1.初始化状态（将数据做一个初始化的劫持， 改变数据，更新视图）
        // vue组件中有很多属性 data props watch computed
        initState(vm);
    }
}
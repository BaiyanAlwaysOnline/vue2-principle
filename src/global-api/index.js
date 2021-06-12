import { mergeOptions } from "../utils/util";

// 全局api，Vue静态方法
export function initGlobalApi(Vue) {
    //全局定义的属性方法都在一个全局对象上；
    Vue.options = {};
    // 混合混入
    Vue.mixin = function (options) {
        this.options = mergeOptions(this.options, options);
    };
}






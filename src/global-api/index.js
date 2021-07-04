import { mergeOptions } from "../utils/util";
import { initExtend } from "./extend";

// 全局api，Vue静态方法
export function initGlobalApi(Vue) {
    //全局定义的属性方法都在一个全局对象上；
    Vue.options = {};
    // 混合混入
    Vue.mixin = function (options) {
        this.options = mergeOptions(this.options, options);
    };

    Vue.options._base = Vue;
    Vue.options.components = {};
    // 插件：拓展extend功能
    initExtend(Vue);

    Vue.component = function (id, definition) {
        definition.name = definition.name || id; // 默认以name为主；
        definition = this.options._base.extend(definition); // Vue.component的核心就是通过Vue的extend方法，生成一个子类
        // Vue.component等价于
        Vue.options.components[id] = definition;
    }

}






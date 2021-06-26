import { compileToFuncs } from "./compiler/index.js";
import { initGlobalApi } from "./global-api/index.js";
import initMixin from "./init";
import { stateMixin } from "./initState.js";
import { lifecycleMixin } from "./lifecycle";
import { renderMixin } from "./vnode/index.js";
import { createElement, patch } from "./vnode/patch.js";

function Vue(options) {
    this._init(options);
}

// 写成一个个的插件对原型扩展，而不是写一个类，把所有方法都写在类里面；
initMixin(Vue); // init data
lifecycleMixin(Vue); // update  patch
renderMixin(Vue); // generate vnode 
initGlobalApi(Vue);
stateMixin(Vue);

export default Vue;
import initMixin from "./init";

function Vue(options) {
    this._init(options);
}

// 写成一个个的插件对原型扩展，而不是写一个类，把所有方法都写在类里面；
initMixin(Vue);

export default Vue;
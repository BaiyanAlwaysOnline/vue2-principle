import { mergeOptions } from "../utils/util";

export function initExtend(Vue) {
    let cid = 0;
    // 创建一个Vue子类，然后返回；
    Vue.extend = function(extendOptions) {
        // 父类
        const Super = this;
        // 创建一个子类
        // ? Q:为啥不用一个父类去创建多个实例; A:实例之间会共享属性；
        const Sub = function VueComponent(options) {
            this._init(options);
        }
        Sub.cid = cid++;
        // 原型链继承
        Sub.prototype = Object.create(Super.prototype);
        Sub.prototype.constructor = Sub;

        // 合并options
        Sub.options = mergeOptions(Super.options, extendOptions);
        Sub.component = Super.component;
        return Sub;
    }
}
// 为什么要拆分成小的组件？
// 1.方便复用;
// 2.方便维护;
// 3.编写组件尽量拆分;
// 4.Vue的更新问题，每一个组件一个渲染watcher，如果一个组件太大，每一次细小的更新都会触发这个watcher，然后执行domdiff等一系列操作；

// 组件渲染流程：
// 1.调用Vue.component
// 2.内部用的Vue.extend产生一个子类来继承父类； 
// 3.创建子类实例时，会调用父类的_init方法, 再$mount即完成挂载,组件$mount()不传参数，
//   会创建真实DOM挂载在组件实例的$el上，createElement是如果发现是组件，直接返回实例的$el就可以了；
// 4.组件的初始化就是new这个组件的构造函数并且调用$mount;
// 5.创建虚拟节点，根据标签筛出组件，生成组件的虚拟节点，组件多一个参数：componentOptions(包含插槽和组件的Ctor)



import arrayProxyMtds from "./array";
import Dep from './dep.js';
// observe功能
class Observer {
    constructor(data) {
        this.dep = new Dep();
        // 不能直接把属性挂载到data上，会造成死循环；
        Object.defineProperty(data, "__ob__", {
            value: this,
            configurable: false, // 冻结属性
            enumerable: false, // 不可枚举，防止死递归
        })
        if (Array.isArray(data)) {
            // 如果是数组，代理数组方法，AOP
            data.__proto__ = arrayProxyMtds;
            this.observeArray(data); // 数组中普通类型不做观察
        }else {
            // 如果是对象，使用defineProperty重写属性
            this.walk(data);
        }
    }
    walk(data) {
        let keys = Object.keys(data);
        keys.forEach(key => {
            defineReactive(data, key, data[key]);
        })
    }
    // 如果数组有成员是Object类型，遍历数组每个成员，劫持
    observeArray(arr) {
        arr.forEach(item => {
            observe(item);
        })
    }
}

function defineReactive(data, key, value) {
    // 对象类型都会返回一个observe实例
    const cDep = observe(value);
    // 递归劫持所有
    const dep = new Dep();
    // 当触发get是，说明取值了 当前属性用来渲染，将当前属性和dep关联起来 
    // 一个属性对应一个dep实例，多个属性可能对应一个watcher -> Dep.target
    Object.defineProperty(data, key, {
        get: () => {
            // 依赖收集
            if (Dep.target) {
                debugger;
                dep.depend();
                // ? 再看看
                if (cDep) {
                    // 默认给数所有的对象类型添加一个dep属性，当对这个数组取值的时候，触发数组存起来的渲染watcher
                    // 这个dep这里只有数组使用；
                    // 对象是提供给Vue.$set使用的
                    cDep.dep.depend();
                }
            }
            return value;
        },
        set: (newValue) => {
            if (newValue === value) return;
            // 如果用户将值换成另一个对象，也将它变成响应式的；
            observe(newValue);
            // 如果使用data[key] = newValue -> 造成死循环
            value = newValue;
            // 依赖更新
            dep.notify();
        }
    })
}

export function observe(data) {
    // 必须是一个objectl类型
    if (typeof data !== 'object' || data == null) return;
    // 观察过了
    if (data.__ob__ instanceof Observer) return data;
    // data中的数据类型多种多样，将observe的功能聚合起来，封装成一个类；而且也可以知道这个实例的class、
    return new Observer(data);
}
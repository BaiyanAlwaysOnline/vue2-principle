import arrayProxyMtds from "./array";

// observe功能
class Observer {
    constructor(data) {
        // 不能直接把属性挂载到data上，会造成死循环；
        Object.defineProperty(data, "__ob__", {
            value: this,
            configurable: false, // 冻结属性
            enumerable: false, // 不可枚举，防止死递归
        })
        if (Array.isArray(data)) {
            // 如果是数组，代理数组方法，AOP
            data.__proto__ = arrayProxyMtds;
            this.observeArray(data);
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
    // 递归劫持所有
    observe(value);
    Object.defineProperty(data, key, {
        get: () => {
            console.log('用户获取值了');
            return value;
        },
        set: (newValue) => {
            if (newValue === value) return;
            console.log('用户设置值了');
            // 如果用户将值换成另一个对象，也将它变成响应式的；
            observe(newValue);
            // 如果使用data[key] = newValue -> 造成死循环
            value = newValue;
        }
    })
}

export function observe(data) {
    // 必须是一个objectl类型
    if (typeof data !== 'object' || data == null) return data;
    // 观察过了
    if (data.__ob__) return data;
    // data中的数据类型多种多样，将observe的功能聚合起来，封装成一个类；
    return new Observer(data);
}
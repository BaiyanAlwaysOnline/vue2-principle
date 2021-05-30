// observe功能
import typeIs from '../utils/typeIs.js';

class Observer {
    constructor(data) {
        // 使用defineProperty重写属性
        this.walk(data);
    }
    walk(data) {
        let keys = Object.keys(data);
        keys.forEach(key => {
            defineReactive(data, key, data[key]);
        })
    }
}

function defineReactive(data, key, value) {
    // 递归劫持所有
    observe(value);
    Object.defineProperty(data, key, {
        get: () => {
            console.log('用户获取值了', value);
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
    // 必须是一个object
    if (!typeIs(data, 'Object')) return;
    // data中的数据类型多种多样，将observe的功能聚合起来，封装成一个类；
    return new Observer(data);
}
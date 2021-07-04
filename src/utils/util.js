// 合并的策略对象
const strats = {};
// 策略有：
// strats.data = function(p, c){
//     return c;
// };
// strats.computed = function(){};
// strats.watch = function(){};

// 组件的合并策略是就近原则，我们可以将全局属性放到原型链上,继承实现； 
strats.components = function(p, c){
    const ret = Object.create(p);
    for (let k in c) {
        ret[k] = c[k];
    }
    return ret;
}; 

// 生命周期的策略
const LIFE_CYCLES = [
    'beforeCreate',
    'created',
    'beforeMount',
    'mounted',
    'beforeUpdate',
    'updated',
    'beforeDestory',
    'destoryed',
]
LIFE_CYCLES.forEach(item => {
    strats[item] = mergeHook;
})
// 生命周期的合并策略 => []
function mergeHook(p, c) {
    if(c) {
        if(p) {
            // p有值，说明不是第一次合并了
            return p.concat(c);
        }else {
            // 第一次调merage options是一个空对象
            return [c];
        }
    }else {
        return p;
    }
}

export function mergeOptions(p, c) {
    // 遍历父亲
    // 父亲有儿子没有 
    // 父亲和儿子都有 
    let options = {};
    for (let key in p) {
        mergeFields(key);
    }
    // 儿子有父亲没有
    for (let key in c) {
        if (!p.hasOwnProperty(key)) {
            mergeFields(key);
        }
    }

    function mergeFields(key) {
        if (strats[key]) {
            // 合并后的结果
            options[key] = strats[key](p[key], c[key]);
        }else {
            // 默认合并,使用子类的
            if (c[key]) {
                options[key] = c[key]
            }else {
                options[key] = p[key]
            }
            
        }
    }

    return options;
}


let cbsQueue = [], timerFunc, pending = false;

function flushCbs() {
    while(cbsQueue.length) {
        const cb = cbsQueue.shift();
        cb();
    }
    pending = false;
}

if(Promise) {
    timerFunc = () => Promise.resolve().then(flushCbs);
}else if(MutationObserver) { // 可以监控Dom的变化，异步更新
    const observer = new MutationObserver(flushCbs);
    const textNode = document.createTextNode(1);
    // 监控文本节点
    observer.observe(textNode, { characterData: true });
    // 变化文本
    timerFunc = () => textNode.textContent = 2;
}else if(setImmediate) {
    // ie里的api，性能好于setTimeout
    timerFunc = () => setImmediate(flushCbs);
}else {
    timerFunc = () => setTimeout(flushCbs);
}
// 用户调用$nextTick会在flush之后执行；
// 同样是批处理
export function nextTick(cb) {
    // Vue3里的nextTick原理就是promise.then, Vue2需要做兼容处理
    cbsQueue.push(cb);
    // 需要做批处理
    if(!pending) {
        pending = true;
        timerFunc();
    }
}

function makeMap(str) {
    const list = str.split(',');
    // 创建真实Dom的映射表；
    const mappings = {};
    for(let i = 0; i < list.length; i++) {
        mappings[list[i]] = true;
    }
    return (key) => mappings[key];
}

export const isReservedTag = makeMap('a,div,p,button,ul,li');
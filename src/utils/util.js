// 合并的策略对象
const strats = {};
// 策略有：
strats.data = function(p, c){
    return c;
};
strats.computed = function(){};
strats.watch = function(){};
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
            options[key] = c[key]
        }
    }

    return options;
}
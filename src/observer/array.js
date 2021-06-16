// 数组的原始方法
const arrayOriginalMtds = Array.prototype;
// 数组的代理方法
const arrayProxyMtds = Object.create(arrayOriginalMtds);
// 代理方法列表 - 改变原数组的方法
const mtdsList = [
    'push',
    'pop',
    'shift',
    'unshift',
    "splice",
    "sort",
    "reverse",
];

mtdsList.forEach(mtd => {
    arrayProxyMtds[mtd] = function(...agv) {
        // 数组代理方法执行了
        console.log('数组代理方法执行了');
        // 如果使用数组的方法，传入了Object类型，劫持
        let inserted, ob = this.__ob__;
        switch (mtd) {
            case 'push':
            case 'unshift':
                inserted = agv;
                break;
            case 'splice':
                inserted = agv.slice(2);
                break;
            default:
                break;
        }
        if (inserted) ob.observeArray(inserted);
        const ret = arrayOriginalMtds[mtd].apply(this, agv);
        ob.dep.notify();
        return ret;
    }
})

export default arrayProxyMtds;

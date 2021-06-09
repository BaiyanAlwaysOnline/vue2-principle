export function patch(oldNode, newVNode) {
    console.log(oldNode, newVNode);
    // 
    const el = createElement(newVNode);
    const parentNode = oldNode.parentNode;
    parentNode.insertBefore(el, oldNode.nextSilibing);
    parentNode.removeChild(oldNode);
    console.log(parentNode);
}

// ! Vue渲染流程
// 先初始化数据（响应式） ->  将模板进行编译  ->  生成render函数   ->   生成vnode   ->   生成真实DOM  ->   挂载

function createElement(vnode) {
    const { tag, data, children, key, text } = vnode;
    if (typeof tag === 'string') { // dom节点
        const el = document.createElement(tag);
        // 当前el有children就递归创建，逐步创建DOM树
        vnode.el = el;
        children.forEach(child => {
            vnode.el.appendChild(createElement(child));
        })
    }else { // 文本节点
        vnode.el = document.createTextNode(text);
    }
    return vnode.el;
}
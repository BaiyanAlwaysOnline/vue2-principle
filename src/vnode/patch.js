export function patch(oldNode, newVNode) {
    const el = createElement(newVNode);
    const parentNode = oldNode.parentNode;
    parentNode.insertBefore(el, oldNode.nextElementSibling);
    parentNode.removeChild(oldNode);
}

// ! Vue渲染流程
// 先初始化数据（响应式） ->  将模板进行编译  ->  生成render函数   ->   生成vnode   ->   生成真实DOM  ->   挂载

function createElement(vnode) {
    const { tag, data, children, key, text } = vnode;
    if (typeof tag === 'string') { // dom节点
        const el = document.createElement(tag);
        // 当前el有children就递归创建，逐步创建DOM树
        vnode.el = el;
        setProperties(vnode);
        children.forEach(child => {
            vnode.el.appendChild(createElement(child));
        })
    }else { // 文本节点
        vnode.el = document.createTextNode(text);
    }
    return vnode.el;
}

function setProperties(vnode) {
    const el = vnode.el;
    const props = vnode.data;
    for (let k in props) {
        if (k === 'style') {
            for (let styleName in props[k]) {
                el.style[styleName] = props[k][styleName];
            }
        }else if(k === 'class') {
            el.className = props[k]
        }else {
            el.setAttribute(k, props[k]);
        }
    }
}
export function patch(oldNode, newVNode) { 
    // 初始化时，直接用创建出来的虚拟节点，替换掉老节点
    if (oldNode.nodeType === 1) { // 表示节点是代表元素
        const el = createElement(newVNode);
        const parentNode = oldNode.parentNode;
        parentNode.insertBefore(el, oldNode.nextElementSibling);
        parentNode.removeChild(oldNode);
        return el;
    }else {
        // 更新时，用老的虚拟节点和新的虚拟节点做对比，将不同的地方更新真实DOM
        // ! 用新的虚拟节点对比老的虚拟节点，找到差异去更新老的dom元素；
        // 两棵树直接比较 On3 的时间复杂度
        // diff算法将On3 -> On
        // 1.逐层比较，标签不同直接替换
        if (oldNode.tag !== newVNode.tag) {
            return oldNode.el.parentNode.replaceNode(createElement(newVNode), oldNode.el)
        }
        if (!oldNode.tag) {
            if (oldNode.text !== newVNode.text) {
                // 文本节点直接替换
               return  oldNode.el.textContent = newVNode.text;
            }
        }
        // 复用旧节点，更新节点属性
        let el = newVNode.el = oldNode.el;
        setProperties(newVNode, oldNode.data);

        // 比对儿子
        const newChild = newVNode.children || [];
        const oldChild = oldNode.children || [];
        if (newChild.length > 0 && oldChild.length > 0) {
            // ! 老的有，新的也有 -> diff算法 核心
            updateChildren(oldChild, newChild, el);
        }else if(oldChild.length > 0) {
            // 老的有儿子，新的没有
            el.innerHTML = '';
        }else if(newChild.length > 0) {
            // 老的没儿子，新的有
            for(let i = 0; i < newChild.length; i ++) {
                const child = newChild[i];
                el.appendChild(createElement(child))
            }
        }
    }
}
 
// ! Vue渲染流程
// 先初始化数据（响应式） ->  将模板进行编译  ->  生成render函数   ->   生成vnode   ->   生成真实DOM  ->   挂载

export function createElement(vnode) {
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

function setProperties(vnode, oldProps = {}) {
    const el = vnode.el;
    const newProps = vnode.data || {};
    // 属性对比：老的有，新的没有
    for (let k in oldProps) {
        if (!newProps[k]) {
            el.removeAttribute(k); // 移除属性
        }
    }
    const newStyle = newProps.style || {};
    const oldStyle = oldProps.style || {};

    // 样式对比
    for (let k in oldStyle) {
        if (!newStyle[k]) {
           el.style[k] = ''; // 移除样式
        }
    }

    // ! 能复用复用

    for (let k in newProps) {
        if (k === 'style') {
            for (let styleName in newProps[k]) {
                el.style[styleName] = newProps[k][styleName];
            }
        }else if(k === 'class') {
            el.className = newProps[k]
        }else {
            el.setAttribute(k, newProps[k]);
        }
    }
}


function updateChildren(oldChild, newChild, parent) {
    // vue中的diff算法做了很多优化
    // DOM中的操作有很多常见逻辑，把节点插到当前儿子的头部，尾部，儿子倒序，正序
    // vue2中采用的是双指针的方式 

    // 做一个循环，同时循环老的和新的，那个先结束，循环就停止，插入或者删除多余的；

    // 旧节点指针
     let oldStartIndex = 0;
     let oldEndIndex = oldChild.length - 1;
     let oldStartNode = oldChild[oldStartIndex];
     let oldEndNode = oldChild[oldEndIndex];
     let map = makeIndexByKey(oldChild);
    // 新节点指针
     let newStartIndex = 0;
     let newEndIndex = newChild.length - 1;
     let newStartNode = newChild[newStartIndex];
     let newEndNode = newChild[newEndIndex];
     // !思考 为什么要有key； 为什么不能用index作为key

     // 循环条件：新旧节点的开始和结束指针都没交叉过
     // old：A B C D
     // new：A B C D E 
     while(oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
         if (!oldStartNode) {  // 如果是null，直接下一步
            oldStartNode = oldChild[++oldStartIndex];
         }else if(!oldEndNode) {
            oldEndNode = oldChild[--oldEndNodeIndex];
         }else if (isSameVnode(oldStartNode, newStartNode)) {
            // 从前往后比
            patch(oldStartNode, newStartNode) // 更新属性，递归更新子节点
            // 移动指针
            oldStartNode = oldChild[++oldStartIndex];
            newStartNode = newChild[++newStartIndex];
        }else if (isSameVnode(oldEndNode, newEndNode)) {
            // 从后往前比
            patch(oldEndNode, newEndNode) // 更新属性，递归更新子节点
            // 移动指针
            oldEndNode = oldChild[--oldEndIndex];
            newEndNode = newChild[--newEndIndex];
        }else if(isSameVnode(oldStartNode, newEndNode)) { 
            // 反转：老的头和新的尾部比较
            patch(oldStartNode, newEndNode) // 更新属性，递归更新子节点
            // old：A B C D
            // new：D C B A
            // 把老的头塞到老的尾部的旁边
            parent.insertBefore(oldStartNode.el, oldEndNode.el.nextsibling);
            oldStartNode = oldChild[++oldStartIndex];
            newEndNode = newChild[--newEndIndex];
        }else if(isSameVnode(oldEndNode, newStartNode)) { 
            // 反转：老的尾和新的头部比较
            patch(oldEndNode, newStartNode) // 更新属性，递归更新子节点
            // old：A B C D
            // new：D C B A
            // 把老的尾塞到老的头部的旁边
            parent.insertBefore(oldEndNode.el, oldStartNode.el);
            oldEndNode = oldChild[--oldEndIndex];
            newStartNode = newChild[++newStartIndex];
        }else {
            // 暴力比对
            // 新的和旧的比，旧的没有的，把新的直接插到旧开始指针的前面，旧指针不变，新指针挪;
            // 旧的有的，挪到旧开始指针的前面，然后置为null，防止数组塌陷
            // old: D F A E C
            // new: E M K D F I A
            const moveIndex = map[newStartNode.key];
            if (moveIndex === undefined) {
                parent.insertBefore(createElement(newStartNode), oldStartNode.el);
            }else {
                let moveNode = oldChildren[moveIndex];
                oldChildren[moveIndex] = null;
                parent.insertBefore(moveNode.el, oldStartNode.el);
                patch(moveNode, newStartNode);
            };
            newStartNode = newChild[++newStartIndex];
        }
     }
     // 如果新的有剩余的，插入
     if (newStartIndex <= newEndIndex) {
        for (let i = newStartIndex; i <= newEndIndex; i++) {
            // parent.appendChild(createElement(newChild[i]));
            // ! 注意：如果从前往后比，是插入到最后，从后往前比，是查到最前
            // ? 如何判断插入到最前还是最后，通过当前元素的下一元素判断
            // nextElem = null, 插入到最后
            // nextElem = el, 插入到最前
            // 使用insertBefore api -> 第二个参数为null时，插入到末尾 === appendChild
            const el = newChild[newEndIndex+1] === null ? null : newChild[newEndIndex+1].el;
            parent.insertBefore(createElement(newChild[i]), el)
        }
     }
     // 如果老的有剩余的，删除
     if (oldStartIndex <= oldEndIndex) {
        for (let i = oldStartIndex; i <= oldEndIndex; i++) {
            if (oldChild[i] != null) {
                parent.removeChild(oldChild[i].el)
            }
        }
     }
}

// 创建旧节点映射表
function makeIndexByKey(children) {
    let map = {};
    children.forEach((child, index) => {
        map[child.key] = index;  // {'A': '0', 'B': '1', 'C': '2'}
    })
    return map;
}

function isSameVnode(oldVnode, newVnode) {
    return oldVnode.tag === newVnode.tag && oldVnode.key === newVnode.key;
}
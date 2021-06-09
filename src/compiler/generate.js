// DOM -> JS 的语法转义 
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;  // {{}}

// 生成元素节点的字符串 _c
export function generate(el) {
    let children = genChildren(el.children);
      let code = `_c('${el.tag}', ${el.attrs.length ? `${genProps(el.attrs)}` : 'undefined'}${
        children ? `,${children}` : ''
      })`
      return code;
}  

function genProps(attrs) {
    let str = '';
    for (let i = 0; i < attrs.length; i++) {
        let attr = attrs[i];
        if(attr.name === 'style') {
            let obj = {};
            attr.value.split(';').forEach(item => {
                let [key, value] = item.split(':');
                obj[key] = value.trim();
            })
            attr.value = obj;
        }
        str += `${attr.name}:${JSON.stringify(attr.value)},`
    }
    return `{${str.slice(0, -1)}}`; 
}

// _v
function genChildren(children) {
    return children.map(child => gen(child)).join(',');
}

function gen(node) {
    // 元素节点类型
    if (node.type == 1) {
        return generate(node);
    }else {
        // 普通文本类型
        let text = node.text;
        if (!defaultTagRE.test(text)) {
            return `_v(${JSON.stringify(text)})`
        }
        // _v('hello {{ name }} word {{}msg}') -> _v('hello'+_s(name)+'word'+_s(msg))
        let tokens = [];
        let lastIndex = defaultTagRE.lastIndex = 0; // 全局的正则，匹配前置为0
        let match, index;
        // 按顺序匹配出所有{{}} 每一次匹配会修改defaultTagRE.lastIndex
        while(match = defaultTagRE.exec(text)) {
            index = match.index;
            if(index > lastIndex) {
                // 说明这一节是文本
                tokens.push(JSON.stringify(text.slice(lastIndex, index)))
            }
            tokens.push(`_s(${match[1].trim()})`)
            lastIndex = index + match[0].length;
        }
        // 补上最后未匹配的文本元素
        if (lastIndex < text.length) {
            tokens.push(JSON.stringify(text.slice(lastIndex)));
        }
        return `_v(${(tokens).join('+')})`
    }
}
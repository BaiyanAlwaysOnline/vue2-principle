

 const ncname = '[a-zA-Z_][\\w\\-\\.]*'; // 匹配标签名
 const qnameCapture = `((?:${ncname}\\:)?${ncname})`; // 匹配 命名空间标签 <my:xxx></my:xxx>
 const startTagOpen = new RegExp(`^<${qnameCapture}`); // 匹配
 const startTagClose = /^\s*(\/?)>/;
 const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`);
 const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;




 
// <div id='app'>hello <p>world</p> <span>!</span>   </div>
 export function parseHTML(html) {
    let root, currentParent, stack = [];
    function start({tagName, attrs}) {
        const element = createASTElement(tagName, attrs);
        if(!root) {
            root = element;
        };
        element.parent = currentParent;
        currentParent = element;
        stack.push(element);
    }
    function end(tagName) {
        const element = stack.pop();
        if (element.tag != tagName) return console.error('标签不符合标准！')
        currentParent = stack[stack.length - 1];
        if (currentParent) {
            currentParent.children.push(element);
        }
    }
    function chars(text) {
        text = text.replace(/\s/g, '');
        if (text) {
            const element = {
                type: 3,
                text
            }
            currentParent.children.push(element);
        }
    }
    function createASTElement(tagName, attrs) {
        return {
            type: 1,
            attrs,
            tag: tagName,
            children: [],
            parent: null,
        }
    }
     // 解析开始标签
    function parseStartTag() {
        const start = html.match(startTagOpen); 
        if (start) { 
            const match = {
                tagName: start[1],
                attrs: []
            };
            advance(start[0].length);
            // 如果直接是闭合标签了 说明没有属性
            let end, attr;
            while(!(end = html.match(startTagClose)) && (attr = html.match(attribute)) ) {
               match.attrs.push({
                   name: attr[1],
                   value: attr[3] || attr[4] || attr[5]
               })
               advance(attr[0].length)
            }
            if (end) {
                advance(end[0].length)
            }
            return match;
        }
    }
    // 前进
    function advance(n) {
      html = html.substring(n);
    }

    while(html) {
        let textEnd = html.indexOf('<'), text;
        if (textEnd == 0) {
            // 是标签
            // 匹配开始标签
            const startTagMatch = parseStartTag();
            if (startTagMatch) {
                start(startTagMatch);
                continue;
            }
            // 匹配结束标签
            const endTagMatch = html.match(endTag);
            if (endTagMatch) {
                advance(endTagMatch[0].length);
                end(endTagMatch[1]);
                continue;
            }

        }
        if (textEnd > 0) {
            // 是文本
            text = html.substring(0, textEnd)
            if (text) {
                chars(text);
                advance(textEnd);
            }
            continue;
        }
        break;
    }

    return root;
 }
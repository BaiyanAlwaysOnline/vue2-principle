/**
 * @description html模板 -> render函数
 * @param {*} tpl 
 */

import { generate } from "./generate";
import { parseHTML } from "./parse";



export function compileToFuncs(tpl) {
    // 1.需要将html代码转化成 ast语法树，用它来描述语言本身
    const ast = parseHTML(tpl);
    // TODO 2. 优化静态节点
    // 3.通过ast树，重新生成代码
    const code = generate(ast);
    // 4.通过 with 将当前动态生成的匿名函数作用域绑到this上，即vm，取值就去vm上面取；
    const render = new Function(`with(this){return ${code}}`);
    return render;
}
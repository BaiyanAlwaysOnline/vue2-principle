import { compileToFuncs } from "./compiler/index.js";
import { initGlobalApi } from "./global-api/index.js";
import initMixin from "./init";
import { stateMixin } from "./initState.js";
import { lifecycleMixin } from "./lifecycle";
import { renderMixin } from "./vnode/index.js";
import { createElement, patch } from "./vnode/patch.js";

function Vue(options) {
    this._init(options);
}

// 写成一个个的插件对原型扩展，而不是写一个类，把所有方法都写在类里面；
initMixin(Vue); // init data
lifecycleMixin(Vue); // update  patch
renderMixin(Vue); // generate vnode 
initGlobalApi(Vue);
stateMixin(Vue);

export default Vue;

// test code
let vm1 = new Vue();
let render1 = compileToFuncs(
    `<div>
        <li style="background: yellow" key='D'>D</li>
        <li style="background: green" key='B'>B</li>
        <li style="background: green" key='F'>F</li>
        <li style="background: red" key='C'>C</li>
        <li style="background: orange" key='A'>A</li>
    </div>`
)

let vnode1 = render1.call(vm1);
document.body.appendChild(createElement(vnode1))

let vm2 = new Vue();
let render2 = compileToFuncs(
    `<div>
        <li style="background: purple" key='CC'>CC</li>
    </div>`
)

let vnode2 = render2.call(vm2);

setTimeout(() => {
    patch(vnode1, vnode2)
}, 2000)
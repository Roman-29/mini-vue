/*
 * @Author: luojw
 * @Date: 2022-04-29 12:26:07
 * @LastEditors: luojw
 * @LastEditTime: 2022-05-03 14:10:07
 * @Description:
 */

import { h } from "../../lib/mini-vue.esm.js";

window.self = null;
export const App = {
  render() {
    window.self = this;
    // ui
    return h(
      "div",
      {
        id: "root",
        class: ["red", "hard"],
        onClick() {
          console.log("click");
        },
        onMousedown() {
          console.log("mousedown");
        },
      },
      // 1. string 类型
      // "helloworld"
      this.msg
      // 2. 数组类型
      // [h("p", { class: "red" }, "hi"), h("p", { class: "blue" }, "mini-vue")]
    );
  },

  setup() {
    return {
      msg: "power by mini-vue",
    };
  },
};

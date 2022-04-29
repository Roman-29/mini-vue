/*
 * @Author: luojw
 * @Date: 2022-04-29 12:26:07
 * @LastEditors: luojw
 * @LastEditTime: 2022-04-29 15:01:05
 * @Description:
 */

import { h } from "../../lib/mini-vue.esm.js";

export const App = {
  render() {
    // ui
    return h(
      "div",
      {
        id: "root",
        class: ["red", "hard"],
      },
      // 1. string 类型
      // "helloworld"
      // 2. 数组类型
      [h("p", { class: "red" }, "hi"), h("p", { class: "blue" }, "mini-vue")]
    );
  },

  setup() {
    return {
      msg: " from mini-vue",
    };
  },
};

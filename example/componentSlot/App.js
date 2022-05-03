/*
 * @Author: luojw
 * @Date: 2022-05-03 21:53:52
 * @LastEditors: luojw
 * @LastEditTime: 2022-05-03 23:56:18
 * @Description:
 */

import { h, createTextVnode } from "../../lib/mini-vue.esm.js";
import { Foo } from "./Foo.js";

export const App = {
  name: "App",
  render() {
    const app = h("div", {}, "App");

    const foo = h(
      Foo,
      {},
      {
        // 作用域插槽, age在子组件中
        header: ({ age }) => h("p", {}, "header" + age),
        footer: () => [h("p", {}, "footer"), createTextVnode("text文本")],
      }
    );

    return h("div", {}, [app, foo]);
  },

  setup() {
    return {};
  },
};

/*
 * @Author: luojw
 * @Date: 2022-05-03 16:54:01
 * @LastEditors: luojw
 * @LastEditTime: 2022-05-03 16:59:40
 * @Description:
 */
import { h } from "../../lib/mini-vue.esm.js";
import { Foo } from "./Foo.js";

export const App = {
  name: "App",
  render() {
    // emit
    return h("div", {}, [
      h("div", {}, "App"),
      h(Foo, {
        onAdd(a, b) {
          console.log("onAdd", a, b);
        },
        onAddFoo() {
          console.log("onAddFoo");
        },
      }),
    ]);
  },

  setup() {
    return {};
  },
};

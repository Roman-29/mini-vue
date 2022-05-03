/*
 * @Author: luojw
 * @Date: 2022-05-04 00:02:20
 * @LastEditors: luojw
 * @LastEditTime: 2022-05-04 00:06:38
 * @Description:
 */
import { h, getCurrentInstance } from "../../lib/mini-vue.esm.js";

export const Foo = {
  name: "Foo",
  setup() {
    const instance = getCurrentInstance();
    console.log("Foo:", instance);
    return {};
  },
  render() {
    return h("div", {}, "foo");
  },
};

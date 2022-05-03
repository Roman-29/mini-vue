/*
 * @Author: luojw
 * @Date: 2022-05-03 21:53:52
 * @LastEditors: luojw
 * @LastEditTime: 2022-05-03 23:01:00
 * @Description:
 */
import { h, renderSlots } from "../../lib/mini-vue.esm.js";

export const Foo = {
  setup() {
    return {};
  },
  render() {
    const foo = h("p", {}, "foo");

    // Foo -> vnode -> children
    console.log(this.$slots);
    // 通过renderSlots把slots转换为vnode参与渲染

    const age = 18;
    return h("div", {}, [
      renderSlots(this.$slots, "header", { age }),
      foo,
      renderSlots(this.$slots, "footer"),
    ]);
  },
};

// 具名插槽
// 1. 获取到要渲染的元素 1
// 2. 要获取到渲染的位置
// 作用域插槽

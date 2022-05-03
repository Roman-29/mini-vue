/*
 * @Author: luojw
 * @Date: 2022-05-03 16:54:01
 * @LastEditors: luojw
 * @LastEditTime: 2022-05-03 17:54:17
 * @Description:
 */
import { h } from "../../lib/mini-vue.esm.js";

export const Foo = {
  name: "foo",
  setup(props, { emit }) {
    const emitAdd = () => {
      console.log("foo: emit");
      emit("add", 1, 2);
      emit("add-foo");
    };

    return {
      emitAdd,
    };
  },
  render() {
    const btn = h(
      "button",
      {
        onClick: this.emitAdd,
      },
      "emitAdd"
    );

    const foo = h("p", {}, "foo");
    return h("div", {}, [foo, btn]);
  },
};

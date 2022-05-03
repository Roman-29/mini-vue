/*
 * @Author: luojw
 * @Date: 2022-05-03 14:13:20
 * @LastEditors: luojw
 * @LastEditTime: 2022-05-03 16:50:52
 * @Description:
 */

import { h } from "../../lib/mini-vue.esm.js";

export const Foo = {
  name: "foo",
  setup(props) {
    // setup函数传入props
    console.log(props);

    // props是shallowReadonly
    props.count++;
    console.log(props);
  },
  render() {
    // this.count可以获取到值
    return h("div", {}, "foo: " + this.count);
  },
};

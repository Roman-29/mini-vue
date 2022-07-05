/*
 * @Author: luojw
 * @Date: 2022-07-05 13:42:09
 * @LastEditors: luojw
 * @LastEditTime: 2022-07-05 13:44:17
 * @Description:
 */
// 新的是 text
// 老的是 text
import { ref, h } from "../../lib/mini-vue.esm.js";

const prevChildren = "oldChild";
const nextChildren = "newChild";

export default {
  name: "TextToText",
  setup() {
    const isChange = ref(false);
    window.isChange = isChange;

    return {
      isChange,
    };
  },
  render() {
    const self = this;

    return self.isChange === true
      ? h("div", {}, nextChildren)
      : h("div", {}, prevChildren);
  },
};

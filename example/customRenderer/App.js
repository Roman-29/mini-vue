/*
 * @Author: luojw
 * @Date: 2022-05-15 22:32:19
 * @LastEditors: luojw
 * @LastEditTime: 2022-05-16 00:12:17
 * @Description:
 */
import { h } from "../../lib/mini-vue.esm.js";

export const App = {
  setup() {
    return {
      x: 100,
      y: 100,
    };
  },
  render() {
    return h("rect", { x: this.x, y: this.y });
  },
};

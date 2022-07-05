/*
 * @Author: luojw
 * @Date: 2022-07-04 17:27:40
 * @LastEditors: luojw
 * @LastEditTime: 2022-07-05 10:01:59
 * @Description:
 */
import { h, ref } from "../../lib/mini-vue.esm.js";

export const App = {
  name: "App",

  setup() {
    const count = ref(0);

    const onClick = () => {
      count.value++;
    };

    return {
      count,
      onClick,
    };
  },
  render() {
    return h(
      "div",
      {
        id: "root",
      },
      [
        h("div", {}, "count:" + this.count), // 依赖收集
        h(
          "button",
          {
            onClick: this.onClick,
          },
          "click"
        ),
      ]
    );
  },
};

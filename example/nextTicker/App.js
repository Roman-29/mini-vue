/*
 * @Author: luojw
 * @Date: 2022-07-22 16:59:37
 * @LastEditors: luojw
 * @LastEditTime: 2022-07-23 19:25:33
 * @Description:
 */
import {
  h,
  ref,
  getCurrentInstance,
  nextTick,
} from "../../lib/mini-vue.esm.js";

export default {
  name: "App",
  setup() {
    const count = ref(1);
    const instance = getCurrentInstance();

    function onClick() {
      for (let i = 0; i < 100; i++) {
        console.log("update");
        count.value = i;
      }

      console.log(instance);
      nextTick(() => {
        console.log(instance);
      });

      // await nextTick()
      // console.log(instance)
    }

    return {
      onClick,
      count,
    };
  },
  render() {
    const button = h("button", { onClick: this.onClick }, "update");
    const p = h("p", {}, "count:" + this.count);

    return h("div", {}, [button, p]);
  },
};

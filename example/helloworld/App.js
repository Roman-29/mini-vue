/*
 * @Author: luojw
 * @Date: 2022-04-29 12:26:07
 * @LastEditors: luojw
 * @LastEditTime: 2022-04-29 13:24:23
 * @Description:
 */

export const App = {
  render() {
    // ui
    return h("div", "helloworld" + this.msg);
  },

  setup() {
    return {
      msg: " from mini-vue",
    };
  },
};

/*
 * @Author: luojw
 * @Date: 2022-05-03 22:17:36
 * @LastEditors: luojw
 * @LastEditTime: 2022-05-03 23:03:57
 * @Description:
 */

import { createVnode } from "../vnode";

export function renderSlots(slots, name, props) {
  const slot = slots[name];

  if (slot) {
    if (typeof slot === "function") {
      // props是作用域插槽的参数
      return createVnode("div", {}, slot(props));
    }
  }
}

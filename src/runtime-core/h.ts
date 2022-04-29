/*
 * @Author: luojw
 * @Date: 2022-04-29 14:08:12
 * @LastEditors: luojw
 * @LastEditTime: 2022-04-29 14:08:12
 * @Description:
 */

import { createVnode } from "./vnode";

export function h(type, props?, children?) {
  return createVnode(type, props, children);
}

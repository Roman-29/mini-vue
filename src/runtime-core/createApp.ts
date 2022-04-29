/*
 * @Author: luojw
 * @Date: 2022-04-29 12:30:40
 * @LastEditors: luojw
 * @LastEditTime: 2022-04-29 13:08:02
 * @Description:
 */

import { render } from "./renderer";
import { createVnode } from "./vnode";

export function createApp(rootComponent) {
  return {
    mount(rootContainer) {
      // 将组建转化为虚拟节点
      // component -> vnode

      const vnode = createVnode(rootComponent);

      render(vnode, rootContainer);
    },
  };
}

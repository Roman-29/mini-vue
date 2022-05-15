/*
 * @Author: luojw
 * @Date: 2022-04-29 12:30:40
 * @LastEditors: luojw
 * @LastEditTime: 2022-05-15 22:15:36
 * @Description:
 */

import { createVnode } from "./vnode";

export function createAppAPI(render) {
  return function createApp(rootComponent) {
    return {
      mount(rootContainer) {
        // 将组建转化为虚拟节点
        // component -> vnode

        const vnode = createVnode(rootComponent);
        render(vnode, rootContainer);
      },
    };
  };
}

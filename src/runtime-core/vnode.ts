/*
 * @Author: luojw
 * @Date: 2022-04-29 12:34:00
 * @LastEditors: luojw
 * @LastEditTime: 2022-04-29 12:35:21
 * @Description:
 */

export function createVnode(type, props?, children?) {
  const vnode = {
    type,
    props,
    children,
  };

  return vnode;
}

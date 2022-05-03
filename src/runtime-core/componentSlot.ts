/*
 * @Author: luojw
 * @Date: 2022-05-03 22:03:52
 * @LastEditors: luojw
 * @LastEditTime: 2022-05-03 23:11:41
 * @Description:
 */

import { ShapeFlags } from "../share/ShapeFlags";

export function initSlots(instance, children) {
  const { vnode } = instance;

  if (vnode.shapeFlag & ShapeFlags.SLOT_CHILDREN) {
    normalizeObjectSlots(children, instance.slots);
  }
}

// 具名插槽
function normalizeObjectSlots(children, slots) {
  for (const key in children) {
    const value = children[key];

    // slot是一个函数, props是作用域插槽的参数
    // 返回一个虚拟节点数组
    slots[key] = (props) => normalizeSlotValue(value(props));
  }
}

// slots需要是数组, 才能在后续被createVnode转换为虚拟节点
function normalizeSlotValue(value) {
  return Array.isArray(value) ? value : [value];
}

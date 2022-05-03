/*
 * @Author: luojw
 * @Date: 2022-05-03 13:58:38
 * @LastEditors: luojw
 * @LastEditTime: 2022-05-03 23:10:00
 * @Description:
 */

// 位运算判断flag
export const enum ShapeFlags {
  ELEMENT = 1, // 0001
  STATEFUL_COMPONENT = 1 << 1, // 0010
  TEXT_CHILDREN = 1 << 2, // 0100
  ARRAY_CHILDREN = 1 << 3, // 1000
  SLOT_CHILDREN = 1 << 4,
}

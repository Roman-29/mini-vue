/*
 * @Author: luojw
 * @Date: 2022-08-10 10:55:05
 * @LastEditors: luojw
 * @LastEditTime: 2022-08-10 10:55:08
 * @Description:
 */

import { NodeTypes } from "./ast";

export function isText(node) {
  return node.type === NodeTypes.TEXT || node.type === NodeTypes.INTERPOLATION;
}

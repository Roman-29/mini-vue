/*
 * @Author: luojw
 * @Date: 2022-04-10 17:00:10
 * @LastEditors: luojw
 * @LastEditTime: 2022-04-21 00:31:11
 * @Description:
 */

import { mutableHandlers, readonlyHandlers } from "./baseHandler";

export function reactive(raw: any) {
  return createReactiveObject(raw, mutableHandlers);
}

export function readonly(raw: any) {
  return createReactiveObject(raw, readonlyHandlers);
}

function createReactiveObject(target, baseHandles) {
  return new Proxy(target, baseHandles);
}

/*
 * @Author: luojw
 * @Date: 2022-04-10 17:00:10
 * @LastEditors: luojw
 * @LastEditTime: 2022-04-21 00:49:24
 * @Description:
 */

import { mutableHandlers, readonlyHandlers } from "./baseHandler";

export const enum ReactiveFlags {
  IS_REACTIVE = "__v_isReactive",
  IS_READONLY = "__v_isReadonly",
}

export function reactive(raw: any) {
  return createReactiveObject(raw, mutableHandlers);
}

export function readonly(raw: any) {
  return createReactiveObject(raw, readonlyHandlers);
}

export function isReactive(value) {
  return !!(value && value[ReactiveFlags.IS_REACTIVE]);
}

export function isReadonly(value) {
  return !!(value && value[ReactiveFlags.IS_READONLY]);
}

function createReactiveObject(target, baseHandles) {
  return new Proxy(target, baseHandles);
}

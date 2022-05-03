/*
 * @Author: luojw
 * @Date: 2022-04-10 17:00:10
 * @LastEditors: luojw
 * @LastEditTime: 2022-05-03 16:49:55
 * @Description:
 */

import { isObject } from "../share/index";
import {
  mutableHandlers,
  readonlyHandlers,
  shallowReadonlyHandlers,
  shallowReactiveHandlers,
} from "./baseHandler";

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

export function shallowReactive(raw) {
  return createReactiveObject(raw, shallowReactiveHandlers);
}

export function shallowReadonly(raw) {
  return createReactiveObject(raw, shallowReadonlyHandlers);
}

export function isReactive(value) {
  return !!(value && value[ReactiveFlags.IS_REACTIVE]);
}

export function isReadonly(value) {
  return !!(value && value[ReactiveFlags.IS_READONLY]);
}

export function isProxy(value) {
  return isReactive(value) || isReadonly(value);
}

function createReactiveObject(target, baseHandles) {
  if (!isObject(target)) {
    console.warn(`target ${target} 必须是一个对象`);
    return target;
  }
  return new Proxy(target, baseHandles);
}

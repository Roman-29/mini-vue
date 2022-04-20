/*
 * @Author: luojw
 * @Date: 2022-04-21 00:26:37
 * @LastEditors: luojw
 * @LastEditTime: 2022-04-21 00:30:57
 * @Description:
 */

import { track, trigger } from "./effect";

function createGetter(isReadonly = false) {
  return function get(target, key) {
    const res = Reflect.get(target, key);

    if (!isReadonly) {
      track(target, key);
    }
    return res;
  };
}

function createSetter() {
  return function set(target, key, value) {
    const res = Reflect.set(target, key, value);
    // 触发effect
    trigger(target, key);
    return res;
  };
}

const get = createGetter();
const set = createSetter();
const readonlyGet = createGetter(true);

export const mutableHandlers = {
  get,
  set,
};

export const readonlyHandlers = {
  get: readonlyGet,
  set(target, key) {
    console.warn(
      `key :"${String(key)}" set 失败，因为 target 是 readonly 类型`,
      target
    );
    return true;
  },
};

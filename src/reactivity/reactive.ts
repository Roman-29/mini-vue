/*
 * @Author: luojw
 * @Date: 2022-04-10 17:00:10
 * @LastEditors: luojw
 * @LastEditTime: 2022-04-10 18:26:18
 * @Description:
 */

import { track, trigger } from "./effect";

export function reactive(raw: any) {
  return new Proxy(raw, {
    get(target, key) {
      const res = Reflect.get(target, key);

      // 存入effect
      track(target, key);

      return res;
    },

    set(target, key, value) {
      const res = Reflect.set(target, key, value);

      // 触发effect
      trigger(target, key);

      return res;
    },
  });
}

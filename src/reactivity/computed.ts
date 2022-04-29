/*
 * @Author: luojw
 * @Date: 2022-04-29 00:01:29
 * @LastEditors: luojw
 * @LastEditTime: 2022-04-29 12:07:25
 * @Description:
 */

import { ReactiveEffect } from "./effect";

class ComputedRefImpl {
  private _effect: ReactiveEffect;
  private _dirty = true;
  private _value: any;

  constructor(getter) {
    this._effect = new ReactiveEffect(getter, {
      scheduler: () => {
        // 依赖发生变化, 需要从新执行getter函数
        this._dirty = true;
      },
    });
  }

  get value() {
    if (this._dirty) {
      // 不再重复执行getter函数
      this._dirty = false;
      this._value = this._effect.run();
    }
    return this._value;
  }
}

export function computed(getter) {
  return new ComputedRefImpl(getter);
}

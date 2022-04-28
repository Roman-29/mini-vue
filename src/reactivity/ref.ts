/*
 * @Author: luojw
 * @Date: 2022-04-28 14:32:20
 * @LastEditors: luojw
 * @LastEditTime: 2022-04-28 23:37:46
 * @Description:
 */

import { hasChanged, isObject } from "../share";
import { isTracking, trackEffects, triggerEffects } from "./effect";
import { reactive } from "./reactive";

class RefImpl {
  private _value;
  private _rawValue;
  // ref自身的依赖收集
  public deps;
  public __v_isRef = true;

  constructor(value) {
    this._value = convert(value);
    this.deps = new Set();
  }

  get value() {
    trackRefValue(this);
    return this._value;
  }
  set value(newValue) {
    this._value = newValue;

    if (hasChanged(newValue, this._rawValue)) {
      this._rawValue = newValue;
      this._value = convert(newValue);
      triggerEffects(this.deps);
    }
  }
}

function convert(value) {
  return isObject(value) ? reactive(value) : value;
}

function trackRefValue(ref) {
  if (isTracking()) {
    trackEffects(ref.deps);
  }
}

export function ref(value) {
  return new RefImpl(value);
}

export function isRef(ref) {
  return !!ref.__v_isRef;
}

export function unRef(ref) {
  // 如果是ref返回value, 否则直接返回
  return isRef(ref) ? ref.value : ref;
}

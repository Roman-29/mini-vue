/*
 * @Author: luojw
 * @Date: 2022-04-10 17:07:36
 * @LastEditors: luojw
 * @LastEditTime: 2022-04-10 18:25:40
 * @Description:
 */

const targetMap = new WeakMap();
let activeEffect: ReactiveEffect;

class ReactiveEffect {
  private _fn: Function;

  constructor(fn: Function) {
    this._fn = fn;
  }

  run() {
    activeEffect = this;
    this._fn();
  }
}

export function track(target: any, key: string | symbol) {
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    depsMap = new Map();
    targetMap.set(target, depsMap);
  }

  let deps = depsMap.get(key);
  if (!deps) {
    deps = new Set();
    depsMap.set(key, deps);
  }

  deps.add(activeEffect);
}

export function trigger(target: any, key: string | symbol) {
  let depsMap = targetMap.get(target);
  let deps = depsMap.get(key);

  deps.forEach((effect) => {
    effect.run();
  });
}

export function effect(fn: Function) {
  const _effect = new ReactiveEffect(fn);

  _effect.run();
}

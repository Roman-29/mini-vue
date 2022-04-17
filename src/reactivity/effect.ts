/*
 * @Author: luojw
 * @Date: 2022-04-10 17:07:36
 * @LastEditors: luojw
 * @LastEditTime: 2022-04-17 21:33:19
 * @Description:
 */

const targetMap = new WeakMap();
let activeEffect: ReactiveEffect;

class ReactiveEffect {
  private _fn: Function;

  constructor(fn: Function, public scheduler) {
    this._fn = fn;
  }

  run() {
    activeEffect = this;
    return this._fn();
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
    if (effect.scheduler) {
      effect.scheduler();
    } else {
      effect.run();
    }
  });
}

export function effect(fn: Function, options: any = {}) {
  const scheduler = options.scheduler;
  const _effect = new ReactiveEffect(fn, scheduler);

  _effect.run();

  const runner = _effect.run.bind(_effect);

  return runner;
}

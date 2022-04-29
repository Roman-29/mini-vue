/*
 * @Author: luojw
 * @Date: 2022-04-10 17:07:36
 * @LastEditors: luojw
 * @LastEditTime: 2022-04-29 12:08:30
 * @Description:
 */

const targetMap = new WeakMap();
let activeEffect: any;

export class ReactiveEffect {
  private _fn: Function;
  public options;

  // 收集挂载这个effect的deps
  public deps: any[] = [];
  // 是否stop状态
  active = true;

  constructor(fn, options: any = {}) {
    this._fn = fn;
    this.options = options;
  }

  run() {
    // 该effect已经被stop, 直接执行函数即可
    if (!this.active) {
      return this._fn();
    }

    // 收集依赖
    activeEffect = this;
    const res = this._fn();
    // 重置属性
    activeEffect = undefined;
    return res;
  }

  stop() {
    if (this.active) {
      cleanupEffect(this);
      if (this.options.onStop) {
        this.options.onStop();
      }
      this.active = false;
    }
  }
}

function cleanupEffect(effect) {
  effect.deps.forEach((dep: any) => {
    dep.delete(effect);
  });

  // 把 effect.deps 清空
  effect.deps.length = 0;
}

export function track(target: any, key: string | symbol) {
  if (!isTracking()) return;

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
  trackEffects(deps);
}

export function trackEffects(deps) {
  // 看看 dep 之前有没有添加过，添加过的话 那么就不添加了
  if (deps.has(activeEffect)) return;

  deps.add(activeEffect);
  activeEffect.deps.push(deps);
}

export function trigger(target: any, key: string | symbol) {
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    // never been tracked
    return;
  }

  let deps = depsMap.get(key);
  triggerEffects(deps);
}

export function triggerEffects(deps) {
  deps.forEach((effect) => {
    if (effect.options.scheduler) {
      effect.options.scheduler();
    } else {
      effect.run();
    }
  });
}

export function effect(fn: Function, options: any = {}) {
  const _effect = new ReactiveEffect(fn, options);

  _effect.run();

  const runner: any = _effect.run.bind(_effect);
  runner.effect = _effect;

  return runner;
}

export function stop(runner) {
  runner.effect.stop();
}

export function isTracking() {
  return activeEffect;
}

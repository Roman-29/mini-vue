/*
 * @Author: luojw
 * @Date: 2022-04-10 17:07:36
 * @LastEditors: luojw
 * @LastEditTime: 2022-04-21 00:05:04
 * @Description:
 */

const targetMap = new WeakMap();
let activeEffect: ReactiveEffect;

class ReactiveEffect {
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
    activeEffect = this;
    return this._fn();
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
}

export function track(target: any, key: string | symbol) {
  if (!activeEffect) return;

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
  activeEffect.deps.push(deps);
}

export function trigger(target: any, key: string | symbol) {
  let depsMap = targetMap.get(target);
  let deps = depsMap.get(key);

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

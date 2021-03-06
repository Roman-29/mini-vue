/*
 * @Author: luojw
 * @Date: 2022-04-10 16:34:44
 * @LastEditors: luojw
 * @LastEditTime: 2022-04-28 13:52:23
 * @Description:
 */

import { reactive } from "../reactive";
import { effect, stop } from "../effect";

describe("effect", () => {
  it("happy path", () => {
    const user = reactive({ age: 10 });

    let nextAge;
    effect(() => {
      nextAge = user.age + 1;
    });

    expect(nextAge).toBe(11);

    // updata
    user.age++;
    expect(nextAge).toBe(12);
  });

  it("should return runner when call effect", () => {
    let foo = 10;
    const runner = effect(() => {
      foo++;
      return foo;
    });
    expect(foo).toBe(11);

    const r = runner();
    expect(foo).toBe(12);
    expect(r).toBe(foo);
  });

  it("scheduler", () => {
    // 1. 通过effect的第二个参数给定 scheduler 函数
    // 2. effect 第一次执行的时候, 会执行第一个参数里的函数
    // 3. 当响应式对象 set(updata) 后不会再执行第一个参数的函数, 而是执行 scheduler 函数
    // 4. 如果当执行 renner 的时候, 会再次执行第一个参数的函数

    let dummy;
    let run: any;
    const scheduler = jest.fn(() => {
      run = runner;
    });
    const obj = reactive({ foo: 1 });
    const runner = effect(
      () => {
        dummy = obj.foo;
      },
      { scheduler }
    );

    // scheduler不会被调用
    expect(scheduler).not.toHaveBeenCalled();
    expect(dummy).toBe(1);
    // should be called on first trigger
    obj.foo++;
    expect(scheduler).toHaveBeenCalledTimes(1);
    obj.foo++;
    expect(scheduler).toHaveBeenCalledTimes(2);
    // should not run yet
    expect(dummy).toBe(1);
    // manually run
    run();
    // should have run
    expect(dummy).toBe(3);
  });

  it("stop", () => {
    let dummy;
    const obj = reactive({ prop: 1 });
    const runner = effect(() => {
      dummy = obj.prop;
    });
    obj.prop = 2;
    expect(dummy).toBe(2);
    stop(runner);

    // obj.prop = 3

    // obj.prop++ ==> obj.prop = obj.prop + 1 (同时触发get和set)
    obj.prop++;
    expect(dummy).toBe(2);

    // stopped effect should still be manually callable
    runner();
    expect(dummy).toBe(3);

    // 确保没有因为runner()重新注册了响应式
    obj.prop++;
    expect(dummy).toBe(3);
  });

  it("onStop", () => {
    const obj = reactive({
      foo: 1,
    });
    const onStop = jest.fn();
    let dummy;
    const runner = effect(
      () => {
        dummy = obj.foo;
      },
      {
        onStop,
      }
    );

    stop(runner);
    expect(onStop).toBeCalledTimes(1);
  });
});

/*
 * @Author: luojw
 * @Date: 2022-04-10 16:56:49
 * @LastEditors: luojw
 * @LastEditTime: 2022-04-21 00:44:16
 * @Description:
 */

import { reactive, isReactive } from "../reactive";

describe("reactive", () => {
  it("happy path", () => {
    const original = { foo: 1 };
    const observed = reactive(original);

    expect(observed).not.toBe(original);
    expect(observed.foo).toBe(1);
    expect(isReactive(observed)).toBe(true);
    expect(isReactive(original)).toBe(false);
  });
});

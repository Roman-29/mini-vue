/*
 * @Author: luojw
 * @Date: 2022-04-10 16:56:49
 * @LastEditors: luojw
 * @LastEditTime: 2022-04-10 17:01:16
 * @Description:
 */

import { reactive } from "../reactive";

describe("reactive", () => {
  it("happy path", () => {
    const original = { foo: 1 };
    const observed = reactive(original);

    expect(observed).not.toBe(original);
    expect(observed.foo).toBe(1);
  });
});

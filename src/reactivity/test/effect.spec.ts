/*
 * @Author: luojw
 * @Date: 2022-04-10 16:34:44
 * @LastEditors: luojw
 * @LastEditTime: 2022-04-10 18:07:57
 * @Description:
 */

import { reactive } from "../reactive";
import { effect } from "../effect";

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
});

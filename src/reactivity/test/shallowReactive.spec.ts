/*
 * @Author: luojw
 * @Date: 2022-04-28 14:16:17
 * @LastEditors: luojw
 * @LastEditTime: 2022-04-28 14:26:47
 * @Description:
 */

import { isReactive, shallowReactive } from "../reactive";

describe("shallowReadonly", () => {
  test("should not make non-reactive properties reactive", () => {
    const props = shallowReactive({ n: { foo: 1 } });
    expect(isReactive(props)).toBe(true);
    expect(isReactive(props.n)).toBe(false);
  });
});

/*
 * @Author: luojw
 * @Date: 2022-07-26 13:13:08
 * @LastEditors: luojw
 * @LastEditTime: 2022-07-26 13:13:13
 * @Description:
 */

import { generate } from "../src/codegen";
import { baseParse } from "../src/parse";
import { transform } from "../src/transform";

describe("codegen", () => {
  it("string", () => {
    const ast = baseParse("hi");
    transform(ast);
    const { code } = generate(ast);
    expect(code).toMatchSnapshot();
  });
});

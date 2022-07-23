/*
 * @Author: luojw
 * @Date: 2022-07-23 23:36:07
 * @LastEditors: luojw
 * @LastEditTime: 2022-07-23 23:41:05
 * @Description:
 */
import { NodeTypes } from "../src/ast";
import { baseParse } from "../src/parse";
describe("Parse", () => {
  describe("interpolation", () => {
    test("simple interpolation", () => {
      const ast = baseParse("{{ message }}");

      expect(ast.children[0]).toStrictEqual({
        type: NodeTypes.INTERPOLATION,
        content: {
          type: NodeTypes.SIMPLE_EXPRESSION,
          content: "message",
        },
      });
    });
  });
});

/*
 * @Author: luojw
 * @Date: 2022-08-10 14:37:00
 * @LastEditors: luojw
 * @LastEditTime: 2022-08-10 14:37:05
 * @Description:
 */

import { generate } from "./codegen";
import { baseParse } from "./parse";
import { transform } from "./transform";
import { transformElement } from "./transforms/transformElement";
import { transformExpression } from "./transforms/transformExpression";
import { transformText } from "./transforms/transformText";

export function baseCompile(template) {
  const ast: any = baseParse(template);
  transform(ast, {
    nodeTransforms: [transformExpression, transformElement, transformText],
  });

  return generate(ast);
}

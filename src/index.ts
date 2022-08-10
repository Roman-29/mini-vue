/*
 * @Author: luojw
 * @Date: 2022-04-29 13:58:10
 * @LastEditors: luojw
 * @LastEditTime: 2022-08-10 15:10:07
 * @Description:
 */

import { baseCompile } from "./compiler-core/src";
import * as runtimeDom from "./runtime-dom";
import { registerRuntimeCompiler } from "./runtime-dom";

export * from "./runtime-dom";

function compileToFunction(template) {
  const { code } = baseCompile(template);
  const render = new Function("Vue", code)(runtimeDom);
  return render;
}

registerRuntimeCompiler(compileToFunction);

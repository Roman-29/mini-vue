/*
 * @Author: luojw
 * @Date: 2022-04-29 13:57:40
 * @LastEditors: luojw
 * @LastEditTime: 2022-04-29 14:39:49
 * @Description:
 */
import typescript from "@rollup/plugin-typescript";
import pkg from "./package.json";

export default {
  input: "./src/index.ts", // 入口文件
  output: [
    // 1. cjs-> commonjs
    // 2. esm
    {
      format: "cjs",
      file: pkg.main,
    },
    {
      format: "es",
      file: pkg.module,
    },
  ],
  plugins: [typescript()],
};

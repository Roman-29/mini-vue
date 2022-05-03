/*
 * @Author: luojw
 * @Date: 2022-05-03 21:53:52
 * @LastEditors: luojw
 * @LastEditTime: 2022-05-03 22:05:37
 * @Description:
 */

import { createApp } from "../../lib/mini-vue.esm.js";
import { App } from "./App.js";

const rootContainer = document.querySelector("#app");
createApp(App).mount(rootContainer);

/*
 * @Author: luojw
 * @Date: 2022-04-29 12:25:02
 * @LastEditors: luojw
 * @LastEditTime: 2022-04-29 14:13:18
 * @Description:
 */

import { createApp } from "../../lib/mini-vue.esm.js";
import { App } from "./App.js";

const rootContainer = document.querySelector("#app");
createApp(App).mount(rootContainer);

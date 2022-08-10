/*
 * @Author: luojw
 * @Date: 2022-08-10 14:35:01
 * @LastEditors: luojw
 * @LastEditTime: 2022-08-10 14:35:21
 * @Description:
 */

import { createApp } from "../../lib/mini-vue.esm.js";
import { App } from "./App.js";

const rootContainer = document.querySelector("#app");
createApp(App).mount(rootContainer);

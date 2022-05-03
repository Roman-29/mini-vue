/*
 * @Author: luojw
 * @Date: 2022-05-04 00:02:20
 * @LastEditors: luojw
 * @LastEditTime: 2022-05-04 00:07:02
 * @Description:
 */

import { createApp } from "../../lib/mini-vue.esm.js";
import { App } from "./App.js";

const rootContainer = document.querySelector("#app");
createApp(App).mount(rootContainer);

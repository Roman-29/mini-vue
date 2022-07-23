/*
 * @Author: luojw
 * @Date: 2022-07-22 16:59:37
 * @LastEditors: luojw
 * @LastEditTime: 2022-07-22 17:12:12
 * @Description:
 */

import { createApp } from "../../lib/mini-vue.esm.js";
import App from "./App.js";

const rootContainer = document.querySelector("#root");
createApp(App).mount(rootContainer);

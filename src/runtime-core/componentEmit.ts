/*
 * @Author: luojw
 * @Date: 2022-05-03 17:07:35
 * @LastEditors: luojw
 * @LastEditTime: 2022-05-03 17:58:21
 * @Description:
 */

import { camelize, toHandlerKey } from "../share/index";

export function emit(instance, event, ...args) {
  console.log("emit: " + event);

  // instance.props -> event
  const { props } = instance;

  const handlerName = toHandlerKey(camelize(event));

  const handler = props[handlerName];
  handler && handler(...args);
}

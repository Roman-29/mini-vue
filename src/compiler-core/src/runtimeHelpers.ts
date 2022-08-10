/*
 * @Author: luojw
 * @Date: 2022-08-09 17:34:09
 * @LastEditors: luojw
 * @LastEditTime: 2022-08-10 10:27:45
 * @Description:
 */

export const TO_DISPLAY_STRING = Symbol("toDisplayString");
export const CREATE_ELEMENT_VNODE = Symbol("createElementVNode");

export const helperMapName = {
  [TO_DISPLAY_STRING]: "toDisplayString",
  [CREATE_ELEMENT_VNODE]: "createElementVNode",
};

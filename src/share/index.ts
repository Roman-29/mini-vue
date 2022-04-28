/*
 * @Author: luojw
 * @Date: 2022-04-28 14:09:32
 * @LastEditors: luojw
 * @LastEditTime: 2022-04-28 14:32:44
 * @Description:
 */

export const isObject = (value) => {
  return value !== null && typeof value === "object";
};

export const hasChanged = (val, newValue) => {
  return !Object.is(val, newValue);
};

/*
 * @Author: luojw
 * @Date: 2022-04-28 14:09:32
 * @LastEditors: luojw
 * @LastEditTime: 2022-05-03 16:52:37
 * @Description:
 */

export const isObject = (value) => {
  return value !== null && typeof value === "object";
};

export const hasChanged = (val, newValue) => {
  return !Object.is(val, newValue);
};

export const hasOwn = (val, key) =>
  Object.prototype.hasOwnProperty.call(val, key);

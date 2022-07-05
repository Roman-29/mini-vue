/*
 * @Author: luojw
 * @Date: 2022-04-28 14:09:32
 * @LastEditors: luojw
 * @LastEditTime: 2022-07-05 13:39:23
 * @Description:
 */

export const EMPTY_OBJ = {};

export const isObject = (value) => {
  return value !== null && typeof value === "object";
};

export const hasChanged = (val, newValue) => {
  return !Object.is(val, newValue);
};

export const hasOwn = (val, key) =>
  Object.prototype.hasOwnProperty.call(val, key);

// add -> Add
const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// add-foo -> addFoo
export const camelize = (str: string) => {
  return str.replace(/-(\w)/g, (_, c: string) => {
    return c ? c.toUpperCase() : "";
  });
};

// 增加on开头
export const toHandlerKey = (str) => {
  return str ? "on" + capitalize(str) : "";
};

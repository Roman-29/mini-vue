/*
 * @Author: luojw
 * @Date: 2022-05-05 16:48:38
 * @LastEditors: luojw
 * @LastEditTime: 2022-05-06 10:51:35
 * @Description:
 */

import { getCurrentInstance } from "./component";

export function provide(key: string, value: any) {
  const currentInstance: any = getCurrentInstance();

  if (currentInstance) {
    let { provides } = currentInstance;

    const parentProvides = currentInstance.parent.provides;

    if (provides === parentProvides) {
      // 初始化当前组件的provides, 使用原型链保持对父组件的provides的关联
      provides = currentInstance.provides = Object.create(parentProvides);
    }

    provides[key] = value;
  }
}

export function inject(key, defaultValue) {
  const currentInstance: any = getCurrentInstance();

  if (currentInstance) {
    const parentProvides = currentInstance.parent.provides;

    if (key in parentProvides) {
      return parentProvides[key];
    } else {
      if (typeof defaultValue === "function") {
        return defaultValue();
      }
      return defaultValue;
    }
  }
}

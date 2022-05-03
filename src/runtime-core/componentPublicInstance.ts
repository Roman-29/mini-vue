/*
 * @Author: luojw
 * @Date: 2022-04-29 16:13:55
 * @LastEditors: luojw
 * @LastEditTime: 2022-05-03 22:09:41
 * @Description:
 */

import { hasOwn } from "../share/index";

const publicPropertiesMap = {
  $el: (i) => i.vnode.el,
  $slots: (i) => i.slots,
};

export const PublicInstanceProxyHandles = {
  get: function ({ _: instance }, key) {
    const { setupState, props } = instance;
    if (key in setupState) {
      return setupState[key];
    }

    if (hasOwn(setupState, key)) {
      return setupState[key];
    } else if (hasOwn(props, key)) {
      return props[key];
    }

    const pulicGetter = publicPropertiesMap[key];
    if (pulicGetter) {
      return pulicGetter(instance);
    }
  },
};

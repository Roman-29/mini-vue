/*
 * @Author: luojw
 * @Date: 2022-04-29 16:13:55
 * @LastEditors: luojw
 * @LastEditTime: 2022-04-29 17:04:44
 * @Description:
 */

const publicPropertiesMap = {
  $el: (i) => i.vnode.el,
};

export const PublicInstanceProxyHandles = {
  get: function ({ _: instance }, key) {
    const { setupState } = instance;
    if (key in setupState) {
      return setupState[key];
    }

    const pulicGetter = publicPropertiesMap[key];
    if (pulicGetter) {
      return pulicGetter(instance);
    }
  },
};

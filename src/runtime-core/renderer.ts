/*
 * @Author: luojw
 * @Date: 2022-04-29 12:38:08
 * @LastEditors: luojw
 * @LastEditTime: 2022-04-29 13:23:05
 * @Description:
 */

import { createComponentInstance, setupComponent } from "./component";

export function render(vnode, container) {
  patch(vnode, container);
}

function patch(vnode, container) {
  // 处理组件
  processComponent(vnode, container);
}

function processComponent(vnode, container) {
  mountComponent(vnode, container);
}

function mountComponent(vnode, container) {
  const instance = createComponentInstance(vnode);

  setupComponent(instance);
  setupRenderEffect(instance, container);
}

function setupRenderEffect(instance, container) {
  const subTree = instance.render();

  // vnode-> patch
  // vnode-> element-> mountElement
  patch(subTree, container);
}

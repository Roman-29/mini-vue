/*
 * @Author: luojw
 * @Date: 2022-04-29 12:44:33
 * @LastEditors: luojw
 * @LastEditTime: 2022-05-06 10:16:31
 * @Description:
 */

import { shallowReadonly } from "../reactivity/reactive";
import { initProps } from "./componentProps";
import { PublicInstanceProxyHandles } from "./componentPublicInstance";
import { emit } from "./componentEmit";
import { initSlots } from "./componentSlot";

export function createComponentInstance(vnode, parent) {
  const component = {
    vnode,
    type: vnode.type,
    setupState: {},
    el: null,
    props: {},
    slots: {},
    provides: parent ? parent.provides : {},
    parent,
    emit: () => {},
  };

  // 锁定第一个参数是组件instance
  component.emit = emit.bind(null, component) as any;

  return component;
}

export function setupComponent(instance) {
  initProps(instance, instance.vnode.props);
  initSlots(instance, instance.vnode.children);

  setupStatefulComponent(instance);
}

function setupStatefulComponent(instance) {
  const Component = instance.type;

  // ctx
  instance.proxy = new Proxy({ _: instance }, PublicInstanceProxyHandles);

  const { setup } = Component;

  if (setup) {
    setCurrentInstance(instance);
    const setupResult = setup(shallowReadonly(instance.props), {
      emit: instance.emit,
    });
    setCurrentInstance(null);

    handleSetupResult(instance, setupResult);
  }
}

function handleSetupResult(instance, setupResult) {
  // function or Object
  // TODO function
  if (typeof setupResult === "object") {
    instance.setupState = setupResult;
  }

  finishComponentSetup(instance);
}

function finishComponentSetup(instance) {
  const Component = instance.type;

  if (Component.render) {
    instance.render = Component.render;
  }
}

let currentInstance = null;

export function getCurrentInstance() {
  return currentInstance;
}

export function setCurrentInstance(instance) {
  currentInstance = instance;
}

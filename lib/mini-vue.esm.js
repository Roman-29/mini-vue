/*
 * @Author: luojw
 * @Date: 2022-04-29 12:44:33
 * @LastEditors: luojw
 * @LastEditTime: 2022-04-29 14:15:55
 * @Description:
 */
function createComponentInstance(vnode) {
    const component = {
        vnode,
        type: vnode.type,
    };
    return component;
}
function setupComponent(instance) {
    // TODO
    // initProps
    // initSlots
    setupStatefulComponent(instance);
}
function setupStatefulComponent(instance) {
    const Component = instance.type;
    const { setup } = Component;
    if (setup) {
        const setupResult = setup();
        handleSetupResult(instance, setupResult);
    }
}
function handleSetupResult(instance, setupResult) {
    // function Object
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

/*
 * @Author: luojw
 * @Date: 2022-04-29 12:38:08
 * @LastEditors: luojw
 * @LastEditTime: 2022-04-29 14:34:10
 * @Description:
 */
function render(vnode, container) {
    patch(vnode);
}
function patch(vnode, container) {
    // 需要判断vnode是组件还是element
    // processElement();
    // 处理组件
    processComponent(vnode);
}
function processComponent(vnode, container) {
    mountComponent(vnode);
}
function mountComponent(vnode, container) {
    const instance = createComponentInstance(vnode);
    setupComponent(instance);
    setupRenderEffect(instance);
}
function setupRenderEffect(instance, container) {
    const subTree = instance.render();
    // vnode-> patch
    // vnode-> element-> mountElement
    patch(subTree);
}

/*
 * @Author: luojw
 * @Date: 2022-04-29 12:34:00
 * @LastEditors: luojw
 * @LastEditTime: 2022-04-29 12:35:21
 * @Description:
 */
function createVnode(type, props, children) {
    const vnode = {
        type,
        props,
        children,
    };
    return vnode;
}

/*
 * @Author: luojw
 * @Date: 2022-04-29 12:30:40
 * @LastEditors: luojw
 * @LastEditTime: 2022-04-29 13:08:02
 * @Description:
 */
function createApp(rootComponent) {
    return {
        mount(rootContainer) {
            // 将组建转化为虚拟节点
            // component -> vnode
            const vnode = createVnode(rootComponent);
            render(vnode);
        },
    };
}

/*
 * @Author: luojw
 * @Date: 2022-04-29 14:08:12
 * @LastEditors: luojw
 * @LastEditTime: 2022-04-29 14:08:12
 * @Description:
 */
function h(type, props, children) {
    return createVnode(type, props, children);
}

export { createApp, h };

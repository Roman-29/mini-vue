/*
 * @Author: luojw
 * @Date: 2022-04-28 14:09:32
 * @LastEditors: luojw
 * @LastEditTime: 2022-04-28 14:32:44
 * @Description:
 */
const isObject = (value) => {
    return value !== null && typeof value === "object";
};

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
const PublicInstanceProxyHandles = {
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

/*
 * @Author: luojw
 * @Date: 2022-04-29 12:44:33
 * @LastEditors: luojw
 * @LastEditTime: 2022-04-29 17:00:39
 * @Description:
 */
function createComponentInstance(vnode) {
    const component = {
        vnode,
        type: vnode.type,
        setupState: {},
        el: null,
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
    // ctx
    instance.proxy = new Proxy({ _: instance }, PublicInstanceProxyHandles);
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
 * @LastEditTime: 2022-04-29 17:07:06
 * @Description:
 */
function render(vnode, container) {
    patch(vnode, container);
}
function patch(vnode, container) {
    // 需要判断vnode是组件还是element
    if (typeof vnode.type === "string") {
        processElement(vnode, container);
    }
    else if (isObject(vnode.type)) {
        // 处理组件
        processComponent(vnode, container);
    }
}
function processElement(vnode, container) {
    mountElement(vnode, container);
}
function mountElement(vnode, container) {
    const el = (vnode.el = document.createElement(vnode.type));
    const { props, children } = vnode;
    for (const key in props) {
        const val = props[key];
        el.setAttribute(key, val);
    }
    if (typeof children === "string") {
        el.textContent = children;
    }
    else if (Array.isArray(children)) {
        mountChildren(vnode, el);
    }
    container.append(el);
}
function mountChildren(vnode, container) {
    vnode.children.forEach((v) => {
        patch(v, container);
    });
}
function processComponent(vnode, container) {
    mountComponent(vnode, container);
}
function mountComponent(initialVNode, container) {
    const instance = createComponentInstance(initialVNode);
    setupComponent(instance);
    setupRenderEffect(instance, initialVNode, container);
}
function setupRenderEffect(instance, initialVNode, container) {
    const { proxy } = instance;
    const subTree = instance.render.call(proxy);
    // vnode-> patch
    // vnode-> element-> mountElement
    patch(subTree, container);
    initialVNode.el = subTree.el;
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
            render(vnode, rootContainer);
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

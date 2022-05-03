/*
 * @Author: luojw
 * @Date: 2022-04-28 14:09:32
 * @LastEditors: luojw
 * @LastEditTime: 2022-05-03 17:34:57
 * @Description:
 */
const isObject = (value) => {
    return value !== null && typeof value === "object";
};
const hasOwn = (val, key) => Object.prototype.hasOwnProperty.call(val, key);
// add -> Add
const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};
// add-foo -> addFoo
const camelize = (str) => {
    return str.replace(/-(\w)/g, (_, c) => {
        return c ? c.toUpperCase() : "";
    });
};
// 增加on开头
const toHandlerKey = (str) => {
    return str ? "on" + capitalize(str) : "";
};

/*
 * @Author: luojw
 * @Date: 2022-04-10 17:07:36
 * @LastEditors: luojw
 * @LastEditTime: 2022-04-29 12:08:30
 * @Description:
 */
const targetMap = new WeakMap();
function trigger(target, key) {
    let depsMap = targetMap.get(target);
    if (!depsMap) {
        // never been tracked
        return;
    }
    let deps = depsMap.get(key);
    triggerEffects(deps);
}
function triggerEffects(deps) {
    deps.forEach((effect) => {
        if (effect.options.scheduler) {
            effect.options.scheduler();
        }
        else {
            effect.run();
        }
    });
}

/*
 * @Author: luojw
 * @Date: 2022-04-21 00:26:37
 * @LastEditors: luojw
 * @LastEditTime: 2022-04-28 14:19:48
 * @Description:
 */
function createGetter(isReadonly = false, shallow = false) {
    return function get(target, key) {
        if (key === "__v_isReactive" /* IS_REACTIVE */) {
            return !isReadonly;
        }
        else if (key === "__v_isReadonly" /* IS_READONLY */) {
            return isReadonly;
        }
        const res = Reflect.get(target, key);
        if (shallow) {
            return res;
        }
        // 判断是否为object
        if (isObject(target[key])) {
            return isReadonly ? readonly(target[key]) : reactive(target[key]);
        }
        return res;
    };
}
function createSetter() {
    return function set(target, key, value) {
        const res = Reflect.set(target, key, value);
        // 触发effect
        trigger(target, key);
        return res;
    };
}
const get = createGetter();
const set = createSetter();
const readonlyGet = createGetter(true);
const shallowReadonlyGet = createGetter(true, true);
const mutableHandlers = {
    get,
    set,
};
const readonlyHandlers = {
    get: readonlyGet,
    set(target, key) {
        console.warn(`key :"${String(key)}" set 失败，因为 target 是 readonly 类型`, target);
        return true;
    },
};
const shallowReadonlyHandlers = {
    get: shallowReadonlyGet,
    set(target, key) {
        console.warn(`key :"${String(key)}" set 失败，因为 target 是 readonly 类型`, target);
        return true;
    },
};

/*
 * @Author: luojw
 * @Date: 2022-04-10 17:00:10
 * @LastEditors: luojw
 * @LastEditTime: 2022-05-03 16:49:55
 * @Description:
 */
function reactive(raw) {
    return createReactiveObject(raw, mutableHandlers);
}
function readonly(raw) {
    return createReactiveObject(raw, readonlyHandlers);
}
function shallowReadonly(raw) {
    return createReactiveObject(raw, shallowReadonlyHandlers);
}
function createReactiveObject(target, baseHandles) {
    if (!isObject(target)) {
        console.warn(`target ${target} 必须是一个对象`);
        return target;
    }
    return new Proxy(target, baseHandles);
}

/*
 * @Author: luojw
 * @Date: 2022-05-03 16:36:19
 * @LastEditors: luojw
 * @LastEditTime: 2022-05-03 16:55:13
 * @Description:
 */
function initProps(instance, rawProps) {
    // 没有props就赋值空对象
    instance.props = rawProps || {};
    // attrs
}

/*
 * @Author: luojw
 * @Date: 2022-04-29 16:13:55
 * @LastEditors: luojw
 * @LastEditTime: 2022-05-03 16:52:27
 * @Description:
 */
const publicPropertiesMap = {
    $el: (i) => i.vnode.el,
};
const PublicInstanceProxyHandles = {
    get: function ({ _: instance }, key) {
        const { setupState, props } = instance;
        if (key in setupState) {
            return setupState[key];
        }
        if (hasOwn(setupState, key)) {
            return setupState[key];
        }
        else if (hasOwn(props, key)) {
            return props[key];
        }
        const pulicGetter = publicPropertiesMap[key];
        if (pulicGetter) {
            return pulicGetter(instance);
        }
    },
};

/*
 * @Author: luojw
 * @Date: 2022-05-03 17:07:35
 * @LastEditors: luojw
 * @LastEditTime: 2022-05-03 17:58:21
 * @Description:
 */
function emit(instance, event, ...args) {
    console.log("emit: " + event);
    // instance.props -> event
    const { props } = instance;
    const handlerName = toHandlerKey(camelize(event));
    const handler = props[handlerName];
    handler && handler(...args);
}

/*
 * @Author: luojw
 * @Date: 2022-04-29 12:44:33
 * @LastEditors: luojw
 * @LastEditTime: 2022-05-03 17:12:28
 * @Description:
 */
function createComponentInstance(vnode) {
    const component = {
        vnode,
        type: vnode.type,
        setupState: {},
        el: null,
        props: {},
        emit: () => { },
    };
    // 锁定第一个参数是组件instance
    component.emit = emit.bind(null, component);
    return component;
}
function setupComponent(instance) {
    // TODO
    initProps(instance, instance.vnode.props);
    // initSlots
    setupStatefulComponent(instance);
}
function setupStatefulComponent(instance) {
    const Component = instance.type;
    // ctx
    instance.proxy = new Proxy({ _: instance }, PublicInstanceProxyHandles);
    const { setup } = Component;
    if (setup) {
        const setupResult = setup(shallowReadonly(instance.props), {
            emit: instance.emit,
        });
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

/*
 * @Author: luojw
 * @Date: 2022-04-29 12:38:08
 * @LastEditors: luojw
 * @LastEditTime: 2022-05-03 14:08:26
 * @Description:
 */
function render(vnode, container) {
    patch(vnode, container);
}
function patch(vnode, container) {
    // 需要判断vnode是组件还是element
    const { shapeFlag } = vnode;
    if (shapeFlag & 1 /* ELEMENT */) {
        processElement(vnode, container);
    }
    else if (shapeFlag & 2 /* STATEFUL_COMPONENT */) {
        // 处理组件
        processComponent(vnode, container);
    }
}
function processElement(vnode, container) {
    mountElement(vnode, container);
}
function mountElement(vnode, container) {
    const el = (vnode.el = document.createElement(vnode.type));
    const { props } = vnode;
    for (const key in props) {
        const val = props[key];
        const isOn = (key) => /^on[A-Z]/.test(key);
        if (isOn(key)) {
            const event = key.slice(2).toLowerCase();
            el.addEventListener(event, val);
        }
        else {
            el.setAttribute(key, val);
        }
    }
    const { children, shapeFlag } = vnode;
    if (shapeFlag & 4 /* TEXT_CHILDREN */) {
        el.textContent = children;
    }
    else if (shapeFlag & 8 /* ARRAY_CHILDREN */) {
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
 * @LastEditTime: 2022-05-03 14:03:56
 * @Description:
 */
function createVnode(type, props, children) {
    const vnode = {
        type,
        props,
        children,
        shapeFlag: getShapeFlag(type),
        el: null,
    };
    if (typeof children === "string") {
        vnode.shapeFlag |= 4 /* TEXT_CHILDREN */;
    }
    else if (Array.isArray(children)) {
        vnode.shapeFlag |= 8 /* ARRAY_CHILDREN */;
    }
    return vnode;
}
function getShapeFlag(type) {
    return typeof type === "string"
        ? 1 /* ELEMENT */
        : 2 /* STATEFUL_COMPONENT */;
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

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/*
 * @Author: luojw
 * @Date: 2022-04-29 12:34:00
 * @LastEditors: luojw
 * @LastEditTime: 2022-07-05 17:26:38
 * @Description:
 */
const Fragment = Symbol("Fragment");
const Text = Symbol("Text");
function createVnode(type, props, children) {
    const vnode = {
        type,
        props,
        children,
        key: props && props.key,
        shapeFlag: getShapeFlag(type),
        el: null,
    };
    // 是否有子节点
    if (typeof children === "string") {
        vnode.shapeFlag |= 4 /* TEXT_CHILDREN */;
    }
    else if (Array.isArray(children)) {
        vnode.shapeFlag |= 8 /* ARRAY_CHILDREN */;
    }
    // 组件是否有slot
    if (vnode.shapeFlag & 2 /* STATEFUL_COMPONENT */) {
        if (typeof children === "object") {
            vnode.shapeFlag |= 16 /* SLOT_CHILDREN */;
        }
    }
    return vnode;
}
function createTextVnode(text) {
    return createVnode(Text, {}, text);
}
function getShapeFlag(type) {
    return typeof type === "string"
        ? 1 /* ELEMENT */
        : 2 /* STATEFUL_COMPONENT */;
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

/*
 * @Author: luojw
 * @Date: 2022-05-03 22:17:36
 * @LastEditors: luojw
 * @LastEditTime: 2022-05-03 23:45:49
 * @Description:
 */
function renderSlots(slots, name, props) {
    const slot = slots[name];
    if (slot) {
        if (typeof slot === "function") {
            // props是作用域插槽的参数
            return createVnode(Fragment, {}, slot(props));
        }
    }
}

/*
 * @Author: luojw
 * @Date: 2022-04-28 14:09:32
 * @LastEditors: luojw
 * @LastEditTime: 2022-07-05 13:39:23
 * @Description:
 */
const EMPTY_OBJ = {};
const isObject = (value) => {
    return value !== null && typeof value === "object";
};
const hasChanged = (val, newValue) => {
    return !Object.is(val, newValue);
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
let activeEffect;
class ReactiveEffect {
    constructor(fn, options = {}) {
        // 收集挂载这个effect的deps
        this.deps = [];
        // 是否stop状态
        this.active = true;
        this._fn = fn;
        this.options = options;
    }
    run() {
        // 该effect已经被stop, 直接执行函数即可
        if (!this.active) {
            return this._fn();
        }
        // 收集依赖
        activeEffect = this;
        const res = this._fn();
        // 重置属性
        activeEffect = undefined;
        return res;
    }
    stop() {
        if (this.active) {
            cleanupEffect(this);
            if (this.options.onStop) {
                this.options.onStop();
            }
            this.active = false;
        }
    }
}
function cleanupEffect(effect) {
    effect.deps.forEach((dep) => {
        dep.delete(effect);
    });
    // 把 effect.deps 清空
    effect.deps.length = 0;
}
function track(target, key) {
    if (!isTracking())
        return;
    let depsMap = targetMap.get(target);
    if (!depsMap) {
        depsMap = new Map();
        targetMap.set(target, depsMap);
    }
    let deps = depsMap.get(key);
    if (!deps) {
        deps = new Set();
        depsMap.set(key, deps);
    }
    trackEffects(deps);
}
function trackEffects(deps) {
    // 看看 dep 之前有没有添加过，添加过的话 那么就不添加了
    if (deps.has(activeEffect))
        return;
    deps.add(activeEffect);
    activeEffect.deps.push(deps);
}
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
function effect(fn, options = {}) {
    const _effect = new ReactiveEffect(fn, options);
    _effect.run();
    const runner = _effect.run.bind(_effect);
    runner.effect = _effect;
    return runner;
}
function isTracking() {
    return activeEffect;
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
        if (!isReadonly) {
            // readonly对象不需要收集依赖, 因为不会触发set
            track(target, key);
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
 * @LastEditTime: 2022-05-03 22:09:41
 * @Description:
 */
const publicPropertiesMap = {
    $el: (i) => i.vnode.el,
    $slots: (i) => i.slots,
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
 * @Date: 2022-05-03 22:03:52
 * @LastEditors: luojw
 * @LastEditTime: 2022-05-03 23:11:41
 * @Description:
 */
function initSlots(instance, children) {
    const { vnode } = instance;
    if (vnode.shapeFlag & 16 /* SLOT_CHILDREN */) {
        normalizeObjectSlots(children, instance.slots);
    }
}
// 具名插槽
function normalizeObjectSlots(children, slots) {
    for (const key in children) {
        const value = children[key];
        // slot是一个函数, props是作用域插槽的参数
        // 返回一个虚拟节点数组
        slots[key] = (props) => normalizeSlotValue(value(props));
    }
}
// slots需要是数组, 才能在后续被createVnode转换为虚拟节点
function normalizeSlotValue(value) {
    return Array.isArray(value) ? value : [value];
}

/*
 * @Author: luojw
 * @Date: 2022-04-28 14:32:20
 * @LastEditors: luojw
 * @LastEditTime: 2022-04-28 23:56:15
 * @Description:
 */
class RefImpl {
    constructor(value) {
        this.__v_isRef = true;
        this._value = convert(value);
        this.deps = new Set();
    }
    get value() {
        trackRefValue(this);
        return this._value;
    }
    set value(newValue) {
        this._value = newValue;
        if (hasChanged(newValue, this._rawValue)) {
            this._rawValue = newValue;
            this._value = convert(newValue);
            triggerEffects(this.deps);
        }
    }
}
function convert(value) {
    return isObject(value) ? reactive(value) : value;
}
function trackRefValue(ref) {
    if (isTracking()) {
        trackEffects(ref.deps);
    }
}
function ref(value) {
    return new RefImpl(value);
}
function isRef(ref) {
    return !!ref.__v_isRef;
}
function unRef(ref) {
    // 如果是ref返回value, 否则直接返回值
    return isRef(ref) ? ref.value : ref;
}
// 场景: 在template里ref不再需要.value
function proxyRefs(objectWithRef) {
    return new Proxy(objectWithRef, {
        get(target, key) {
            // 如果是ref返回value, 否则直接返回值
            return unRef(Reflect.get(target, key));
        },
        set(target, key, value) {
            if (isRef(target[key]) && !isRef(value)) {
                // 替换ref的value值
                return (target[key].value = value);
            }
            else {
                return (target[key] = value);
            }
        },
    });
}

/*
 * @Author: luojw
 * @Date: 2022-04-29 12:44:33
 * @LastEditors: luojw
 * @LastEditTime: 2022-07-04 22:37:19
 * @Description:
 */
function createComponentInstance(vnode, parent) {
    const component = {
        vnode,
        type: vnode.type,
        setupState: {},
        el: null,
        props: {},
        slots: {},
        provides: parent ? parent.provides : {},
        parent,
        isMounted: false,
        subTree: {},
        emit: () => { },
    };
    // 锁定第一个参数是组件instance
    component.emit = emit.bind(null, component);
    return component;
}
function setupComponent(instance) {
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
        instance.setupState = proxyRefs(setupResult);
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
function getCurrentInstance() {
    return currentInstance;
}
function setCurrentInstance(instance) {
    currentInstance = instance;
}

/*
 * @Author: luojw
 * @Date: 2022-05-05 16:48:38
 * @LastEditors: luojw
 * @LastEditTime: 2022-05-06 10:51:35
 * @Description:
 */
function provide(key, value) {
    const currentInstance = getCurrentInstance();
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
function inject(key, defaultValue) {
    const currentInstance = getCurrentInstance();
    if (currentInstance) {
        const parentProvides = currentInstance.parent.provides;
        if (key in parentProvides) {
            return parentProvides[key];
        }
        else {
            if (typeof defaultValue === "function") {
                return defaultValue();
            }
            return defaultValue;
        }
    }
}

/*
 * @Author: luojw
 * @Date: 2022-04-29 12:30:40
 * @LastEditors: luojw
 * @LastEditTime: 2022-05-15 22:15:36
 * @Description:
 */
function createAppAPI(render) {
    return function createApp(rootComponent) {
        return {
            mount(rootContainer) {
                // 将组建转化为虚拟节点
                // component -> vnode
                const vnode = createVnode(rootComponent);
                render(vnode, rootContainer);
            },
        };
    };
}

/*
 * @Author: luojw
 * @Date: 2022-04-29 12:38:08
 * @LastEditors: luojw
 * @LastEditTime: 2022-07-06 13:53:50
 * @Description:
 */
function createRenderer(options) {
    const { createElement: hostCreateElement, patchProp: hostPatchProp, insert: hostInsert, remove: hostRemove, setElementText: hostSetElementText, } = options;
    function render(vnode, container) {
        patch(null, vnode, container, null, null);
    }
    // n1,n2代表新旧虚拟节点
    function patch(n1, n2, container, parentComponent, anchor) {
        // 需要判断vnode是组件还是element
        const { type, shapeFlag } = n2;
        switch (type) {
            // Fragment只渲染children
            case Fragment:
                processFragment(n1, n2, container, parentComponent, anchor);
                break;
            case Text:
                processText(n1, n2, container);
                break;
            default:
                if (shapeFlag & 1 /* ELEMENT */) {
                    processElement(n1, n2, container, parentComponent, anchor);
                }
                else if (shapeFlag & 2 /* STATEFUL_COMPONENT */) {
                    // 处理组件
                    processComponent(n1, n2, container, parentComponent, anchor);
                }
                break;
        }
    }
    function processFragment(n1, n2, container, parentComponent, anchor) {
        mountChildren(n2.children, container, parentComponent, anchor);
    }
    function processText(n1, n2, container) {
        const { children } = n2;
        const textNode = (n2.el = document.createTextNode(children));
        container.append(textNode);
    }
    function processElement(n1, n2, container, parentComponent, anchor) {
        if (!n1) {
            mountElement(n2, container, parentComponent, anchor);
        }
        else {
            patchElement(n1, n2, container, parentComponent, anchor);
        }
    }
    function patchElement(n1, n2, container, parentComponent, anchor) {
        console.log("patchElement");
        console.log("current", n2);
        console.log("prev", n1);
        const oldProps = n1.props || EMPTY_OBJ;
        const newProps = n2.props || EMPTY_OBJ;
        const el = (n2.el = n1.el);
        patchProps(el, oldProps, newProps);
        patchChildren(n1, n2, el, parentComponent, anchor);
    }
    function patchProps(el, oldProps, newProps) {
        if (oldProps !== newProps) {
            for (const key in newProps) {
                const prevProp = oldProps[key];
                const nextProp = newProps[key];
                if (prevProp !== nextProp) {
                    hostPatchProp(el, key, prevProp, nextProp);
                }
            }
            // 删除旧props多余的属性
            if (oldProps !== EMPTY_OBJ) {
                for (const key in oldProps) {
                    if (!(key in newProps)) {
                        hostPatchProp(el, key, oldProps[key], null);
                    }
                }
            }
        }
    }
    function patchChildren(n1, n2, container, parentComponent, anchor) {
        const prevShapeFlag = n1.shapeFlag;
        const shapeFlag = n2.shapeFlag;
        const c1 = n1.children;
        const c2 = n2.children;
        if (shapeFlag & 4 /* TEXT_CHILDREN */) {
            // 更新子节点是 Text 类型
            if (prevShapeFlag & 8 /* ARRAY_CHILDREN */) {
                // 把旧的子节点清空
                unmountChildren(c1);
            }
            if (c1 !== c2) {
                // 设置 Text
                hostSetElementText(container, c2);
            }
        }
        else {
            // 更新子节点是 数组
            if (prevShapeFlag & 4 /* TEXT_CHILDREN */) {
                // 清空
                hostSetElementText(container, "");
                mountChildren(c2, container, parentComponent, anchor);
            }
            else {
                // diff 算法
                patchKeyedChildren(c1, c2, container, parentComponent, anchor);
            }
        }
    }
    function patchKeyedChildren(c1, c2, container, parentComponent, parentAnchor) {
        let i = 0;
        let e1 = c1.length - 1;
        let e2 = c2.length - 1;
        function isSomeVNodeType(n1, n2) {
            // type
            // key
            return n1.type === n2.type && n1.key === n2.key;
        }
        // 左侧对比
        while (i <= e1 && i <= e2) {
            const n1 = c1[i];
            const n2 = c2[i];
            if (isSomeVNodeType(n1, n2)) {
                // 继续刷新节点下的内容
                patch(n1, n2, container, parentComponent, parentAnchor);
            }
            else {
                // 节点完全不一致, 对比结束, 得到 i 为左侧相同元素的后一位下标
                break;
            }
            i++;
        }
        // 右侧对比
        while (i <= e1 && i <= e2) {
            const n1 = c1[e1];
            const n2 = c2[e2];
            if (isSomeVNodeType(n1, n2)) {
                // 继续刷新节点下的内容
                patch(n1, n2, container, parentComponent, parentAnchor);
            }
            else {
                // 节点完全不一致, 对比结束, 得到 e1,e2 为右侧相同元素的前一位下标
                break;
            }
            e1--;
            e2--;
        }
        if (i > e1) {
            if (i <= e2) {
                // 新的比旧的多 创建后续节点
                const nextPos = e2 + 1;
                const anchor = nextPos < c2.length ? c2[nextPos].el : null;
                while (i <= e2) {
                    patch(null, c2[i], container, parentComponent, anchor);
                    i++;
                }
            }
        }
        else if (i > e2) {
            while (i <= e1) {
                // 新的比旧的少 删除多余节点
                hostRemove(c1[i].el);
                i++;
            }
        }
    }
    function unmountChildren(children) {
        for (let i = 0; i < children.length; i++) {
            const el = children[i].el;
            // remove
            hostRemove(el);
        }
    }
    function mountElement(vnode, container, parentComponent, anchor) {
        const el = (vnode.el = hostCreateElement(vnode.type));
        const { props } = vnode;
        for (const key in props) {
            const val = props[key];
            hostPatchProp(el, key, null, val);
        }
        const { children, shapeFlag } = vnode;
        if (shapeFlag & 4 /* TEXT_CHILDREN */) {
            el.textContent = children;
        }
        else if (shapeFlag & 8 /* ARRAY_CHILDREN */) {
            mountChildren(vnode.children, el, parentComponent, anchor);
        }
        hostInsert(el, container, anchor);
    }
    function mountChildren(children, container, parentComponent, anchor) {
        children.forEach((v) => {
            patch(null, v, container, parentComponent, anchor);
        });
    }
    function processComponent(n1, n2, container, parentComponent, anchor) {
        mountComponent(n2, container, parentComponent, anchor);
    }
    function mountComponent(initialVNode, container, parentComponent, anchor) {
        const instance = createComponentInstance(initialVNode, parentComponent);
        setupComponent(instance);
        setupRenderEffect(instance, initialVNode, container, anchor);
    }
    function setupRenderEffect(instance, initialVNode, container, anchor) {
        effect(() => {
            if (!instance.isMounted) {
                const { proxy } = instance;
                // 保存subTree
                const subTree = (instance.subTree = instance.render.call(proxy));
                console.log(subTree);
                // vnode-> patch
                // vnode-> element-> mountElement
                patch(null, subTree, container, instance, anchor);
                initialVNode.el = subTree.el;
                instance.isMounted = true;
            }
            else {
                console.log("updata");
                const { proxy } = instance;
                const subTree = instance.render.call(proxy);
                const prevSubTree = instance.subTree;
                // 获取新旧subTree并更新
                instance.subTree = subTree;
                patch(prevSubTree, subTree, container, instance, anchor);
            }
        });
    }
    return {
        createApp: createAppAPI(render),
    };
}

/*
 * @Author: luojw
 * @Date: 2022-05-15 21:23:38
 * @LastEditors: luojw
 * @LastEditTime: 2022-07-06 10:36:49
 * @Description:
 */
function createElement(type) {
    return document.createElement(type);
}
function patchProp(el, key, prevVal, nextVal) {
    const isOn = (key) => /^on[A-Z]/.test(key);
    if (isOn(key)) {
        const event = key.slice(2).toLowerCase();
        el.addEventListener(event, nextVal);
    }
    else {
        if (nextVal === undefined || nextVal === null) {
            el.removeAttribute(key);
        }
        else {
            el.setAttribute(key, nextVal);
        }
    }
}
function insert(child, container, anchor) {
    container.insertBefore(child, anchor || null);
}
function remove(child) {
    const parent = child.parentNode;
    if (parent) {
        parent.removeChild(child);
    }
}
function setElementText(el, text) {
    el.textContent = text;
}
const renderer = createRenderer({
    createElement,
    patchProp,
    insert,
    remove,
    setElementText,
});
function createApp(...args) {
    return renderer.createApp(...args);
}

exports.createApp = createApp;
exports.createRenderer = createRenderer;
exports.createTextVnode = createTextVnode;
exports.getCurrentInstance = getCurrentInstance;
exports.h = h;
exports.inject = inject;
exports.provide = provide;
exports.proxyRefs = proxyRefs;
exports.ref = ref;
exports.renderSlots = renderSlots;

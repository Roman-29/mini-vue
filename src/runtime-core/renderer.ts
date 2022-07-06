/*
 * @Author: luojw
 * @Date: 2022-04-29 12:38:08
 * @LastEditors: luojw
 * @LastEditTime: 2022-07-06 13:53:50
 * @Description:
 */

import { effect } from "../reactivity/effect";
import { EMPTY_OBJ } from "../share";
import { ShapeFlags } from "../share/ShapeFlags";
import { createComponentInstance, setupComponent } from "./component";
import { createAppAPI } from "./createApp";
import { Fragment, Text } from "./vnode";

export function createRenderer(options) {
  const {
    createElement: hostCreateElement,
    patchProp: hostPatchProp,
    insert: hostInsert,
    remove: hostRemove,
    setElementText: hostSetElementText,
  } = options;

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
        if (shapeFlag & ShapeFlags.ELEMENT) {
          processElement(n1, n2, container, parentComponent, anchor);
        } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
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
    } else {
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

    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      // 更新子节点是 Text 类型
      if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        // 把旧的子节点清空
        unmountChildren(c1);
      }
      if (c1 !== c2) {
        // 设置 Text
        hostSetElementText(container, c2);
      }
    } else {
      // 更新子节点是 数组
      if (prevShapeFlag & ShapeFlags.TEXT_CHILDREN) {
        // 清空
        hostSetElementText(container, "");
        mountChildren(c2, container, parentComponent, anchor);
      } else {
        // diff 算法
        patchKeyedChildren(c1, c2, container, parentComponent, anchor);
      }
    }
  }

  function patchKeyedChildren(
    c1,
    c2,
    container,
    parentComponent,
    parentAnchor
  ) {
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
      } else {
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
      } else {
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
    } else if (i > e2) {
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

    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      el.textContent = children;
    } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
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
      } else {
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

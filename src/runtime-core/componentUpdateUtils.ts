/*
 * @Author: luojw
 * @Date: 2022-07-10 15:16:16
 * @LastEditors: luojw
 * @LastEditTime: 2022-07-10 15:16:22
 * @Description:
 */

export function shouldUpdateComponent(prevVNode, nextVNode) {
  const { props: prevProps } = prevVNode;
  const { props: nextProps } = nextVNode;

  for (const key in nextProps) {
    if (nextProps[key] !== prevProps[key]) {
      return true;
    }
  }

  return false;
}

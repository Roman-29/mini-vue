import { NodeTypes } from "./ast";

/*
 * @Author: luojw
 * @Date: 2022-07-23 23:36:07
 * @LastEditors: luojw
 * @LastEditTime: 2022-07-23 23:50:02
 * @Description:
 */
export function baseParse(content: string) {
  const context = createParserContext(content);
  return createRoot(parseChildren(context));
}

function createParserContext(content: string): any {
  return {
    source: content,
  };
}

function parseChildren(context) {
  const nodes: any = [];

  let node;
  if (context.source.startsWith("{{")) {
    // 解析插值
    node = parseInterpolation(context);
  }

  nodes.push(node);

  return nodes;
}

function parseInterpolation(context) {
  // {{ message }}

  const openDelimiter = "{{";
  const closeDelimiter = "}}";

  const closeIndex = context.source.indexOf(
    closeDelimiter,
    openDelimiter.length
  );

  advanceBy(context, openDelimiter.length);

  const rawContentLength = closeIndex - openDelimiter.length;

  const rawContent = context.source.slice(0, rawContentLength);
  const content = rawContent.trim();

  advanceBy(context, rawContentLength + closeDelimiter.length);

  return {
    type: NodeTypes.INTERPOLATION,
    content: {
      type: NodeTypes.SIMPLE_EXPRESSION,
      content: content,
    },
  };
}

// 推进内容
function advanceBy(context: any, length: number) {
  context.source = context.source.slice(length);
}

function createRoot(children) {
  return {
    children,
  };
}

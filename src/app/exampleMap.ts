import { getWebGLContext } from "../examples/1.webglContext";

/**
 * 示例函数映射表
 */
const ExampleMap: {
  [key: string]: () => void;
} = {
  1: getWebGLContext,
};

/**
 * 返回示例回调函数
 */
export function getExampleCall(key: string) {
  return ExampleMap[key] || null;
}

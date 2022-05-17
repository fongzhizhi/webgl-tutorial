import { getWebGLContext } from "../examples/1.webglContext";
import { drawASquare } from "../examples/2.drawASquare";
import { drawASquareOfColor } from "../examples/3.drawASquareOfColor";

/**
 * 示例函数映射表
 */
const ExampleMap: {
  [key: string]: () => void;
} = {
  1: getWebGLContext,
  2: drawASquare,
  3: drawASquareOfColor,
};

/**
 * 返回示例回调函数
 */
export function getExampleCall(key: string) {
  return ExampleMap[key] || null;
}

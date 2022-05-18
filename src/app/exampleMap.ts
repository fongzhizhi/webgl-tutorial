import { getWebGLContext } from "../examples/1.webglContext";
import { drawingASquare } from "../examples/2.drawingASquare";
import { drawingASquareOfColor } from "../examples/3.drawingASquareOfColor";
import { drawingAAnimatingSquare } from "../examples/4.drawingAAnimatingSquare";
import { drawingAAnimationCube } from "../examples/5.drawingACube";

/**
 * 实例函数映射表
 */
const ExampleMap: {
  [key: string]: () => void;
} = {
  1: getWebGLContext,
  2: drawingASquare,
  3: drawingASquareOfColor,
  4: drawingAAnimatingSquare,
  5: drawingAAnimationCube,
};

/**
 * 返回实例回调函数
 */
export function getExampleCall(key: string) {
  return ExampleMap[key] || null;
}

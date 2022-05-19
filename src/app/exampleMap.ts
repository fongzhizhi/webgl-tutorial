import { getWebGLContext } from "../examples/1.webglContext";
import { drawingASquare } from "../examples/2.drawingASquare";
import { drawingASquareOfColor } from "../examples/3.drawingASquareOfColor";
import { drawingAAnimatingSquare } from "../examples/4.drawingAAnimatingSquare";
import { drawingAAnimationCube } from "../examples/5.drawingACube";
import { usingTextureOnCube } from "../examples/6.usingTextureOnCube";
import { usingLighting } from "../examples/7.usingLighting";
import { usingVedioTextureOnCube } from "../examples/8.usingVedioTextureOnCube";

/**
 * 实例函数映射表
 */
export const ExampleMap: {
  [key: string]: () => void;
} = {
  1: getWebGLContext,
  2: drawingASquare,
  3: drawingASquareOfColor,
  4: drawingAAnimatingSquare,
  5: drawingAAnimationCube,
  6: usingTextureOnCube,
  7: usingLighting,
  8: usingVedioTextureOnCube,
};

/**
 * 返回实例回调函数
 */
export function getExampleCall(key: string) {
  return ExampleMap[key] || null;
}

import { drawBBoxs } from "../examples/advance_1.bboxDrawer";
import { drawBBoxsByHomogeneous } from "../examples/advance_2.homogeneous";
import { getWebGLContext } from "../examples/base_1.webglContext";
import { drawingASquare } from "../examples/base_2.drawingASquare";
import { drawingASquareOfColor } from "../examples/base_3.drawingASquareOfColor";
import { drawingAAnimatingSquare } from "../examples/base_4.drawingAAnimatingSquare";
import { drawingAAnimationCube } from "../examples/base_5.drawingACube";
import { usingTextureOnCube } from "../examples/base_6.usingTextureOnCube";
import { usingLighting } from "../examples/base_7.usingLighting";
import { usingVedioTextureOnCube } from "../examples/base_8.usingVedioTextureOnCube";
import { drawAFullCircleByTriangle } from "../examples/sample_1.drawAFullCircleByTriangle";
import { drawAFullCircle } from "../examples/sample_2.drawAFullCircle";
import { drawAFullCircle2 } from "../examples/sample_3.drawAFullCircle2";
import { drawALine } from "../examples/sample_4.drawALine";
import { lookAtTrangles } from "../examples/sample_5.lookAtTrangles";
import { lookAtRotatedTrangles } from "../examples/sample_6.lookAtRotatedTrangles";
import { lookAtRotatedTranglesUseProjection } from "../examples/sample_7.lookAtTranglesUsePerojection";
import { drawACubeByElements } from "../examples/sample_8.drawACubeByElements";
import { drawALightedCube } from "../examples/sample_9.drawALightedCube";

/**
 * 示例函数映射表
 */
export const ExampleMap: {
  [key: string]: () => void;
} = {
  // base
  base_1: getWebGLContext,
  base_2: drawingASquare,
  base_3: drawingASquareOfColor,
  base_4: drawingAAnimatingSquare,
  base_5: drawingAAnimationCube,
  base_6: usingTextureOnCube,
  base_7: usingLighting,
  base_8: usingVedioTextureOnCube,
  // advance
  advance_1: drawBBoxs,
  advance_2: drawBBoxsByHomogeneous,
  // sample
  sample_1: drawAFullCircleByTriangle,
  sample_2: drawAFullCircle,
  sample_3: drawAFullCircle2,
  sample_4: drawALine,
  sample_5: lookAtTrangles,
  sample_6: lookAtRotatedTrangles,
  sample_7: lookAtRotatedTranglesUseProjection,
  sample_8: drawACubeByElements,
  sample_9: drawALightedCube,
};

/**
 * 返回示例回调函数
 */
export function getExampleCall(key: string) {
  return ExampleMap[key] || null;
}

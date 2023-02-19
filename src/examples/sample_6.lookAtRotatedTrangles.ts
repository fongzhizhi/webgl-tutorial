import { mat4, vec3 } from "gl-matrix";
import { WebGLRender } from "../webgl/WebGLRender";
import { basicRender, BasicUniformData } from "./utils/basicRender";

/**
 * 使用视图矩阵观测旋转的三角形
 * @source Chapter 7 - *webgl programming guide*
 */
export function lookAtRotatedTrangles() {
  return basicRender({
    getVertexs,
    getUniforms,
    draw,
  });
}

/**获取顶点数据 */
function getVertexs() {
  // [position * 3, color * 3];
  return [
    // 绿色三角形
    0.0, 0.5, -0.4, 0.4, 1.0, 0.4, -0.5, -0.5, -0.4, 0.4, 1.0, 0.4, 0.5, -0.5,
    -0.4, 1.0, 0.4, 0.4,
    // 黄色三角形
    0.5, 0.4, -0.2, 1.0, 0.4, 0.4, -0.5, 0.4, -0.2, 1.0, 1.0, 0.4, 0.0, -0.6,
    -0.2, 1.0, 0.4, 0.4,
    // 蓝色三角形
    0, 0.5, 0, 0.4, 0.4, 1.0, -0.5, -0.5, 0, 0.4, 0.4, 1.0, 0.5, -0.5, 0, 1.0,
    0.4, 0.4,
  ];
}

/**获取uniform数据 */
function getUniforms(render: WebGLRender): BasicUniformData {
  return {
    mvpMatrix: getMvpMatrix(render),
  };
}

/**获取模型视图投影矩阵 */
function getMvpMatrix(render: WebGLRender) {
  // 模型矩阵
  const modelMatrix = mat4.create();
  mat4.rotate(modelMatrix, modelMatrix, -10, [0, 0, 1]);
  // 视图矩阵
  const viewMatrix = mat4.create();
  const eye = vec3.fromValues(0.2, 0.25, 0.25);
  const target = vec3.fromValues(0, 0, 0);
  const up = vec3.fromValues(0, 1, 0);
  mat4.lookAt(viewMatrix, eye, target, up);
  // 投影矩阵
  const projectionMatrix = mat4.create();
  // 模型视图投影矩阵
  const mvpMatrix = mat4.create();
  mat4.multiply(mvpMatrix, projectionMatrix, viewMatrix);
  mat4.multiply(mvpMatrix, mvpMatrix, modelMatrix);
  return mvpMatrix;
}

/**执行绘制 */
function draw(render: WebGLRender, count: number) {
  const gl = render.gl;
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLES, 0, count);
}

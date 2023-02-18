import { mat4, vec3 } from "gl-matrix";
import { WebGLRender } from "../webgl/WebGLRender";
import { basicRender, BasicUniformData } from "./utils/basicRender";

/**
 * 使用drawElements绘制立方体
 * @source Chapter 4 - *webgl programming guide*
 */
export function drawACubeByElements() {
  return basicRender({
    getVertexs,
    getElementIndexs,
    getUniforms,
    draw,
  });
}

/**获取顶点数据 */
function getVertexs() {
  return [
    1, 1, 1, 0, 1, 1, -1, 1, 1, 1, 0, 0, -1, -1, 1, 1, 1, 0, 1, -1, 1, 1, 0, 1,
    1, -1, -1, 0, 0, 1, 1, 1, -1, 1, 1, 0, -1, 1, -1, 0, 0, 0, -1, -1, -1, 0, 1,
    0,
  ];
}

/**获取elements索引 */
function getElementIndexs() {
  return [
    0, 1, 2, 0, 2, 3, 0, 3, 4, 0, 4, 5, 0, 5, 6, 0, 6, 1, 1, 6, 7, 1, 7, 2, 7,
    4, 3, 7, 3, 2, 4, 7, 6, 4, 6, 5,
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
  // 视图矩阵
  const viewMatrix = mat4.create();
  const eye = vec3.fromValues(3, 3, 7);
  const target = vec3.fromValues(0, 0, 0);
  const up = vec3.fromValues(0, 1, 0);
  mat4.lookAt(viewMatrix, eye, target, up);
  // 投影矩阵
  const projectionMatrix = mat4.create();
  const fieldOfView = (30 * Math.PI) / 180;
  const canvas = render.canvas as HTMLCanvasElement;
  const aspect = canvas.clientWidth / canvas.clientHeight;
  mat4.perspective(projectionMatrix, fieldOfView, aspect, 1.0, 100.0); // 透视投影
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
  gl.drawElements(gl.TRIANGLES, count, gl.UNSIGNED_BYTE, 0);
}

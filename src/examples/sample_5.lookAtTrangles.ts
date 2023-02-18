import { mat4, vec3 } from "gl-matrix";
import { WebGLRender } from "../webgl/WebGLRender";
import { basicRender, BasicUniformData } from "./utils/basicRender";

/**
 * 使用视图矩阵观测三角形
 * @source Chapter 4 - *webgl programming guide*
 */
export function lookAtTrangles() {
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
function getUniforms(): BasicUniformData {
  return {
    mvpMatrix: getMvpMatrix(),
  };
}

/**获取模型视图投影矩阵 */
function getMvpMatrix() {
  const eye = vec3.fromValues(0.2, 0.25, 0.25);
  const target = vec3.fromValues(0, 0, 0);
  const up = vec3.fromValues(0, 1, 0);
  const viewMatrix = mat4.lookAt(mat4.create(), eye, target, up);
  return viewMatrix;
}

/**执行绘制 */
function draw(render: WebGLRender, count: number) {
  const gl = render.gl;
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLES, 0, count);
}

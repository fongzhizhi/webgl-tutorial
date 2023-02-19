import { mat4, vec3 } from "gl-matrix";
import { WebGLRender } from "../webgl/WebGLRender";
import { basicRender, BasicUniformData } from "./utils/basicRender";

/**
 * 使用透视投影观察三角形
 * @source Chapter 7 - *webgl programming guide*
 */
export function lookAtRotatedTranglesUseProjection() {
  return basicRender({
    getVertexs,
    getUniforms,
    draw,
  });
}

/**获取顶点数据 */
function getVertexs() {
  // [position * 3, color * 3];
  // 三个三角形
  const threeTrangles = [
    0.0,
    1.0,
    -4.0,
    0.4,
    1.0,
    0.4, // 绿色三角形在最后面
    -0.5,
    -1.0,
    -4.0,
    0.4,
    1.0,
    0.4,
    0.5,
    -1.0,
    -4.0,
    1.0,
    0.4,
    0.4,
    0.0,
    1.0,
    -2.0,
    1.0,
    1.0,
    0.4, // 黄色三角形在中间
    -0.5,
    -1.0,
    -2.0,
    1.0,
    1.0,
    0.4,
    0.5,
    -1.0,
    -2.0,
    1.0,
    0.4,
    0.4,
    0.0,
    1.0,
    0.0,
    0.4,
    0.4,
    1.0, // 蓝色三角形在最前面
    -0.5,
    -1.0,
    0.0,
    0.4,
    0.4,
    1.0,
    0.5,
    -1.0,
    0.0,
    1.0,
    0.4,
    0.4,
  ];
  const vertexs: number[] = [];
  createOneGroup([0.75, 0, 0]);
  createOneGroup([-0.75, 0, 0]);
  return vertexs;

  /**创建一组三角形 */
  function createOneGroup(translateVec3: vec3) {
    const modelMatrix = mat4.create();
    mat4.translate(modelMatrix, modelMatrix, translateVec3);

    const arrayStride = 6;
    for (
      let i = 0;
      i < threeTrangles.length - arrayStride + 1;
      i += arrayStride
    ) {
      const position = vec3.fromValues(
        threeTrangles[i],
        threeTrangles[i + 1],
        threeTrangles[i + 2]
      );
      vec3.transformMat4(position, position, modelMatrix);
      vertexs.push(
        position[0],
        position[1],
        position[2],
        threeTrangles[i + 3],
        threeTrangles[i + 4],
        threeTrangles[i + 5]
      );
    }
  }
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
  const eye = vec3.fromValues(0, 0, 5);
  const target = vec3.fromValues(0, 0, -100);
  const up = vec3.fromValues(0, 1, 0);
  mat4.lookAt(viewMatrix, eye, target, up);
  // 投影矩阵
  const projectionMatrix = mat4.create();
  // mat4.ortho(projectionMatrix, -1, 1, -1, 1, 0, 2.0); // 正射投影
  const fieldOfView = (45 * Math.PI) / 180;
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
  gl.drawArrays(gl.TRIANGLES, 0, count);
}

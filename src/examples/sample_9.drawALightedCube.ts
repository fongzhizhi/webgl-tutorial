import { mat4, vec3 } from "gl-matrix";
import { WebGLRender } from "../webgl/WebGLRender";
import { lightRender, LightUniformData } from "./utils/lightRender";

/**
 * 绘制光照下的立方体
 * @source Chapter 8 - *webgl programming guide*
 */
export function drawALightedCube() {
  return lightRender({
    getVertexs,
    getUniforms,
    draw,
  });
}

/**获取顶点数据 */
function getVertexs() {
  const cubeVertexMap = {
    v0: [1, 1, 1],
    v1: [-1, 1, 1],
    v2: [-1, -1, 1],
    v3: [1, -1, 1],
    v4: [1, -1, -1],
    v5: [1, 1, -1],
    v6: [-1, 1, -1],
    v7: [-1, -1, -1],
  };
  const faceVertexMap: {
    [face: string]: {
      /**顶点 */
      vertex: number[][];
      /**法向量 */
      normal: number[];
    };
  } = {
    front: {
      vertex: [
        cubeVertexMap.v1,
        cubeVertexMap.v2,
        cubeVertexMap.v0,
        cubeVertexMap.v3,
      ],
      normal: [0, 0, 1],
    },
    back: {
      vertex: [
        cubeVertexMap.v6,
        cubeVertexMap.v7,
        cubeVertexMap.v5,
        cubeVertexMap.v4,
      ],
      normal: [0, 0, -1],
    },
    left: {
      vertex: [
        cubeVertexMap.v1,
        cubeVertexMap.v2,
        cubeVertexMap.v6,
        cubeVertexMap.v7,
      ],
      normal: [-1, 0, 0],
    },
    right: {
      vertex: [
        cubeVertexMap.v0,
        cubeVertexMap.v3,
        cubeVertexMap.v5,
        cubeVertexMap.v4,
      ],
      normal: [1, 0, 0],
    },
    up: {
      vertex: [
        cubeVertexMap.v1,
        cubeVertexMap.v0,
        cubeVertexMap.v6,
        cubeVertexMap.v5,
      ],
      normal: [0, 1, 0],
    },
    down: {
      vertex: [
        cubeVertexMap.v7,
        cubeVertexMap.v2,
        cubeVertexMap.v4,
        cubeVertexMap.v3,
      ],
      normal: [0, -1, 0],
    },
  };
  const color = [0.2, 0.5, 1];

  const vertexs: number[] = [];
  for (let face in faceVertexMap) {
    const faces = faceVertexMap[face];
    faces.vertex.forEach((vertex) => {
      vertexs.push(...vertex, ...color, ...faces.normal);
    });
  }
  return vertexs;
}

/**获取uniform数据 */
function getUniforms(render: WebGLRender): LightUniformData {
  return {
    mvpMatrix: getMvpMatrix(render),
    lightColor: [1.0, 1.0, 1.0], // white
    lightDirection: vec3.normalize(vec3.create(), [0.5, 3.0, 4.0]),
    ambientLight: [0.2, 0.3, 0.4], // weak white
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
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, count);
}

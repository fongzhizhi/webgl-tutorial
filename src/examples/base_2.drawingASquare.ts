import { mat4 } from "gl-matrix";
import { $$ } from "../utils/xml";
import {
  VertexAttrOption,
  WebGLBufferUsage,
  WebGLDrawType,
  WebGLVertexDataType,
} from "../webgl/Constants";
import { initCanvas } from "../webgl/Utils";
import { WebGLRender } from "../webgl/WebGLRender";

/**
 * 绘制一个正方形
 */
export function drawingASquare() {
  // 构建渲染器
  const render = new WebGLRender($$("#glcanvas") as HTMLCanvasElement);
  const gl = render.gl;
  // 初始化画布
  initCanvas(gl);
  // 创建着色器程序
  const program = createProgram(render);
  if (!program) {
    return;
  }
  // 创建顶点缓冲并关联顶点属性
  loadVertexBuffer(render, program);
  // 开启渲染状态，传递 uniform 变量值
  loadUniform(render, program);
  // 绘制
  draw(gl);
}

/**
 * 创建着色器程序
 * @param render
 */
function createProgram(render: WebGLRender) {
  const vs = `
    attribute vec4 aVertexPosition;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    void main() {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
    }
  `;
  const fs = `
  void main() {
    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
  }
`;
  return render.createProgramBySource(vs, fs);
}

/**
 * 创建顶点缓冲并关联顶点属性
 * @param render 渲染器
 * @param program 着色器程序
 */
function loadVertexBuffer(render: WebGLRender, program: WebGLProgram) {
  const vertexs = [1.0, 1.0, 0, -1.0, 1.0, 0, 1.0, -1.0, 0, -1.0, -1.0, 0]; // 正方形顶点数据
  const vertexAttrOpt: VertexAttrOption = {
    index: render.getAttribLocation(program, "aVertexPosition"),
    size: 3,
    type: WebGLVertexDataType.FLOAT,
    normalized: false,
    stride: 0,
    offset: 0,
  };
  render.createArrayBuffer(
    {
      data: new Float32Array(vertexs),
      usage: WebGLBufferUsage.STATIC_DRAW,
    },
    [vertexAttrOpt]
  );
}

/**
 * 开启渲染状态，传递 uniform 变量值
 * @param render 渲染器
 * @param program 程序
 * @param radian modelViewMatrix的旋转弧度
 */
export function loadUniform(
  render: WebGLRender,
  program: WebGLProgram,
  radian?: Partial<{
    x: number;
    y: number;
    z: number;
  }>
) {
  const gl = render.gl;
  gl.useProgram(program); // 将程序添加到渲染状态(此状态开启后，才能关联uniform属性)
  const projectionMatrixLoc = render.getUniformLocation(
    program,
    "uProjectionMatrix"
  );
  const modelViewMatrixLoc = render.getUniformLocation(
    program,
    "uModelViewMatrix"
  );
  const projectionMatrix = mat4.create();
  const fieldOfView = (45 * Math.PI) / 180;
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  const zNear = 0.1;
  const zFar = 100.0;
  mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);
  const modelViewMatrix = mat4.create();
  mat4.translate(modelViewMatrix, modelViewMatrix, [-0.0, 0.0, -6.0]);
  if (radian) {
    !isNaN(radian.x) &&
      mat4.rotate(modelViewMatrix, modelViewMatrix, radian.x, [1, 0, 0]); // 绕 x 轴旋转
    !isNaN(radian.y) &&
      mat4.rotate(modelViewMatrix, modelViewMatrix, radian.y, [0, 1, 0]); // 绕 y 轴旋转
    !isNaN(radian.z) &&
      mat4.rotate(modelViewMatrix, modelViewMatrix, radian.z, [0, 0, 1]); // 绕 z 轴旋转
  }
  // 关联参数值
  gl.uniformMatrix4fv(projectionMatrixLoc, false, projectionMatrix);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, modelViewMatrix);
  return {
    projectionMatrix,
    modelViewMatrix,
  };
}

/**
 * 绘制
 * @param gl 绘图上下文
 */
export function draw(gl: WebGLRenderingContext) {
  const mode = gl[WebGLDrawType.TRIANGLE_STRIP]; // 绘制类型
  const first = 0; // 绘制起点
  const vertexCount = 4; // 绘制点总数
  gl.drawArrays(mode, first, vertexCount);
}

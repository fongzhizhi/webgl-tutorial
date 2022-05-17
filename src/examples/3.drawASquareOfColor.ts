import { mat4 } from "gl-matrix";
import { $$ } from "../utils/xml";
import {
  VertexAttrOption,
  WebGLBufferUsage,
  WebGLDrawType,
  WebGLVertexDataType,
} from "../webgl/Constants";
import { WebGLRender } from "../webgl/WebGLRender";

/**
 * 绘制一个带颜色的正方形
 */
export function drawASquareOfColor() {
  // 构建渲染器
  const render = new WebGLRender($$("#glcanvas") as HTMLCanvasElement);
  const gl = render.gl;
  // 初始化画布
  initCanvas(gl);
  // 创建着色器程序
  const program = createProgram(render);
  // 创建顶点缓冲并关联顶点属性
  loadVertexBuffer(render, program);
  // 开启渲染状态，传递 uniform 变量值
  loadUniform(render, program);
  // 绘制
  draw(gl);
}

/**初始化画布状态 */
function initCanvas(gl: WebGLRenderingContext) {
  gl.clearColor(0, 0, 0, 1); // 使用完全不透明的黑色清除所有图像
  gl.clearDepth(1); // 清空所有图元
  gl.enable(gl.DEPTH_TEST); // 启用深度测试
  gl.depthFunc(gl.LEQUAL); // 指定深度比较函数
  gl.clear(gl.COLOR_BUFFER_BIT); // 清空画布
}

/**
 * 创建着色器程序
 * @param render
 */
function createProgram(render: WebGLRender) {
  const vs = `
  attribute vec4 aVertexPosition;
  attribute vec4 aVertexColor;

  uniform mat4 uModelViewMatrix;
  uniform mat4 uProjectionMatrix;

  varying lowp vec4 vColor;

  void main() {
    gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
    vColor = aVertexColor;
  }
`;
  const fs = `
  varying lowp vec4 vColor;
  void main() {
    gl_FragColor = vColor;
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
  // 设置顶点缓冲
  const vertices = [
    1.0,
    1.0,
    0, // 右上
    -1.0,
    1.0,
    0, // 左上
    1.0,
    -1.0,
    0, // 右下
    -1.0,
    -1.0,
    0, // 左下
  ]; // 正方形顶点数据
  const vertexAttrOpt: VertexAttrOption = {
    index: render.getAttribLocation(program, "aVertexPosition"),
    size: 3,
    type: WebGLVertexDataType.FLOAT,
    normalized: false,
    stride: 0,
    offset: 0,
  };
  render.createBuffer(
    {
      data: new Float32Array(vertices),
      usage: WebGLBufferUsage.STATIC_DRAW,
    },
    vertexAttrOpt
  );

  // 设置颜色(RGB)缓冲
  const colors = [
    1,
    1,
    1,
    1, // 白色
    1,
    0,
    0,
    1, // 红色
    0,
    1,
    0,
    1, // 绿色
    0,
    0,
    1,
    1, // 蓝色
  ];
  const colorAttrOpt: VertexAttrOption = {
    index: render.getAttribLocation(program, "aVertexColor"),
    size: 4,
    type: WebGLVertexDataType.FLOAT,
    normalized: false,
    stride: 0,
    offset: 0,
  };
  render.createBuffer(
    {
      data: new Float32Array(colors),
      usage: WebGLBufferUsage.STATIC_DRAW,
    },
    colorAttrOpt
  );
}

/**
 * 开启渲染状态，传递 uniform 变量值
 * @param render 渲染器
 * @param program 程序
 */
function loadUniform(render: WebGLRender, program: WebGLProgram) {
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
  // 关联参数值
  gl.uniformMatrix4fv(projectionMatrixLoc, false, projectionMatrix);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, modelViewMatrix);
}

/**
 * 绘制
 * @param gl 绘图上下文
 */
function draw(gl: WebGLRenderingContext) {
  const mode = gl[WebGLDrawType.TRIANGLE_STRIP]; // 绘制类型
  const first = 0; // 绘制起点
  const vertexCount = 4; // 绘制点总数
  gl.drawArrays(mode, first, vertexCount);
}

import { $$ } from "../utils/xml";
import {
  VertexAttrOption,
  WebGLBufferUsage,
  WebGLVertexDataType,
} from "../webgl/Constants";
import { WebGLRender } from "../webgl/WebGLRender";
import { initCanvas, draw, loadUniform } from "./base_2.drawingASquare";

/**
 * 绘制一个带颜色的正方形
 */
export function drawingASquareOfColor(radian?: number) {
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
  loadUniform(render, program, {
    z: radian,
  });
  // 绘制
  draw(gl);
}

/**
 * 创建着色器程序
 * @param render
 */
export function createProgram(render: WebGLRender) {
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
  const vertexs = [
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
  render.createArrayBuffer(
    {
      data: new Float32Array(vertexs),
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
  render.createArrayBuffer(
    {
      data: new Float32Array(colors),
      usage: WebGLBufferUsage.STATIC_DRAW,
    },
    colorAttrOpt
  );
}

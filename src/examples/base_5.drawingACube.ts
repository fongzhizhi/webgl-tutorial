import { $$ } from "../utils/xml";
import {
  VertexAttrOption,
  WebGLBufferType,
  WebGLBufferUsage,
  WebGLCoordinate,
  WebGLDrawElementType,
  WebGLDrawType,
  WebGLVertexDataType,
} from "../webgl/Constants";
import { WebGLRender } from "../webgl/WebGLRender";
import { initCanvas, loadUniform } from "./base_2.drawingASquare";
import { createProgram } from "./base_3.drawingASquareOfColor";
import { requestAnimationFrameDraw } from "./base_4.drawingAAnimatingSquare";

/**绘制动态立方体 */
export function drawingAAnimationCube() {
  requestAnimationFrameDraw(drawingACube);
}

/**
 * 绘制一个立方体
 */
export function drawingACube(radian: number) {
  // 构建渲染器
  const render = new WebGLRender($$("#glcanvas") as HTMLCanvasElement);
  const gl = render.gl;
  // 初始化画布
  initCanvas(gl);
  // 创建着色器程序
  const program = createProgram(render);
  // 创建顶点缓冲并关联顶点属性
  loadVertexBuffer(render, program);
  // 开启渲染状态，传递 uniform  变量
  loadUniform(render, program, {
    y: radian * 0.7,
    z: radian,
  });
  // 绘制
  draw(gl);
}

/**
 * 创建顶点缓冲并关联顶点属性
 * @param render 渲染器
 * @param program 着色器程序
 */
export function loadVertexBuffer(render: WebGLRender, program: WebGLProgram) {
  // 顶点坐标
  loadPositionBuffer(render, program);
  // 顶点颜色
  loadColorBuffer(render, program);
  // 顶点索引
  loadIndexBuffer(render);
}

/**顶点位置缓冲 */
export function loadPositionBuffer(render: WebGLRender, program: WebGLProgram) {
  // 顶点(6个面，每个面四个顶点，以正方体中心为原点, 共计24个点, 实际8个点)
  const point_LBF = [
    WebGLCoordinate.X_L,
    WebGLCoordinate.Y_B,
    WebGLCoordinate.Z_F,
  ];
  const point_RBF = [
    WebGLCoordinate.X_R,
    WebGLCoordinate.Y_B,
    WebGLCoordinate.Z_F,
  ];
  const point_RTF = [
    WebGLCoordinate.X_R,
    WebGLCoordinate.Y_T,
    WebGLCoordinate.Z_F,
  ];
  const point_LTF = [
    WebGLCoordinate.X_L,
    WebGLCoordinate.Y_T,
    WebGLCoordinate.Z_F,
  ];
  const point_LTB = [
    WebGLCoordinate.X_L,
    WebGLCoordinate.Y_T,
    WebGLCoordinate.Z_B,
  ];
  const point_RTB = [
    WebGLCoordinate.X_R,
    WebGLCoordinate.Y_T,
    WebGLCoordinate.Z_B,
  ];
  const point_RBB = [
    WebGLCoordinate.X_R,
    WebGLCoordinate.Y_B,
    WebGLCoordinate.Z_B,
  ];
  // const point_LBB = [WebGLCoordinate.X_L, WebGLCoordinate.Y_B, WebGLCoordinate.Z_B];
  const frontFace: number[] = [].concat(
    point_LBF,
    point_RBF,
    point_RTF,
    point_LTF
  );
  const topFace: number[] = [].concat(
    point_LTB,
    point_LTF,
    point_RTF,
    point_RTB
  );
  const rightFace: number[] = [].concat(
    point_RBB,
    point_RTB,
    point_RTF,
    point_RBF
  );
  function mirrorPoints(points: number[], index: 0 | 1 | 2) {
    const newArr: number[] = [];
    let i = 0;
    points.forEach((item) => {
      if (i === index) {
        item = -item;
      }
      newArr.push(item);
      i++;
      i > 2 && (i = 0);
    });
    return newArr;
  }
  const backFace = mirrorPoints(frontFace, 2);
  const bottomFace = mirrorPoints(topFace, 1);
  const leftFace = mirrorPoints(rightFace, 0);
  const vertexs = [].concat(
    frontFace,
    backFace,
    topFace,
    bottomFace,
    rightFace,
    leftFace
  );
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
}

/**顶点颜色缓冲 */
function loadColorBuffer(render: WebGLRender, program: WebGLProgram) {
  const faceColors = [
    [1.0, 1.0, 1.0, 1.0], // Front face: white
    [1.0, 0.0, 0.0, 1.0], // Back face: red
    [0.0, 1.0, 0.0, 1.0], // Top face: green
    [0.0, 0.0, 1.0, 1.0], // Bottom face: blue
    [1.0, 1.0, 0.0, 1.0], // Right face: yellow
    [1.0, 0.0, 1.0, 1.0], // Left face: purple
  ];
  let vertexColors: number[] = [];

  for (let i = 0; i < faceColors.length; i++) {
    const c = faceColors[i];
    // 每个面的四个点颜色相同
    vertexColors = vertexColors.concat(c, c, c, c);
  }
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
      data: new Float32Array(vertexColors),
      usage: WebGLBufferUsage.STATIC_DRAW,
    },
    colorAttrOpt
  );
}

/**顶点索引缓冲 */
export function loadIndexBuffer(render: WebGLRender) {
  // 顶点索引(每个面需要使用到四个点，由两个三角形组成，每个三角形三个顶点，实际绘制时使用6个点)
  const vertexIndex: number[] = [];
  for (let i = 0; i < 6; i++) {
    const j = i * 4;
    vertexIndex.push(j, j + 1, j + 2);
    vertexIndex.push(j, j + 2, j + 3);
  }
  render.createBuffer(
    {
      data: new Uint16Array(vertexIndex),
      usage: WebGLBufferUsage.STATIC_DRAW,
    },
    WebGLBufferType.ELEMENT_ARRAY_BUFFER
  );
}

/**
 * 绘制
 * @param gl 绘图上下文
 */
export function draw(gl: WebGLRenderingContext) {
  const mode = gl[WebGLDrawType.TRIANGLE_STRIP]; // 绘制类型
  const type = gl[WebGLDrawElementType.UNSIGNED_SHORT]; // 缓冲类型
  const vertexCount = 36; // 顶点数量(6个面，每个面由两个三角形组成)
  gl.drawElements(mode, vertexCount, type, 0);
}

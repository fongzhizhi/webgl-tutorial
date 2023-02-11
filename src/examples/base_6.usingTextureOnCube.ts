import { $$ } from "../utils/xml";
import {
  TexImage2DInternalformat,
  TexImage2DTexelType,
  WebGLBufferUsage,
  WebGLVertexDataType,
} from "../webgl/Constants";
import { WebGLRender } from "../webgl/WebGLRender";
import { initCanvas } from "../webgl/Utils";
import { loadUniform } from "./base_2.drawingASquare";
import { requestAnimationFrameDraw } from "./base_4.drawingAAnimatingSquare";
import {
  draw,
  loadIndexBuffer,
  loadPositionBuffer,
} from "./base_5.drawingACube";

/**
 * 在立方体表面使用贴图
 */
export function usingTextureOnCube() {
  requestAnimationFrameDraw(drawingACube);
}

/**
 * 绘制一个立方体
 */
export function drawingACube(
  radian: number,
  imageSource?: TexImageSource | ArrayBufferView
) {
  // 构建渲染器
  const render = new WebGLRender($$("#glcanvas") as HTMLCanvasElement);
  const gl = render.gl;
  // 初始化画布
  initCanvas(gl);
  // 创建着色器程序
  const program = createProgram(render);
  // 创建顶点缓冲并关联顶点属性
  const cubeTexTure = loadVertexBuffer(render, program, imageSource);
  // 开启渲染状态，传递 uniform  变量
  loadUniform(render, program, {
    y: radian * 0.8,
    z: radian,
  });
  // 设置 uniform 采样器 uSampler 的值
  loadUniform_uSampler(render, program, cubeTexTure);
  // 绘制
  draw(gl);
}

/**
 * 创建着色器程序
 */
export function createProgram(render: WebGLRender) {
  const vs = `
    attribute vec4 aVertexPosition;
    attribute vec4 aTextureCoord;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    varying lowp vec4 vTextureCoord;

    void main() {
        gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
        vTextureCoord = aTextureCoord;
    }
  `;
  const fs = `
    varying lowp vec4 vTextureCoord;

    uniform sampler2D uSampler;
    
    void main() {
      // 采集纹素(纹理像素值)
      gl_FragColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));
    }
  `;
  return render.createProgramBySource(vs, fs);
}

/**
 * 创建顶点缓冲并关联顶点属性
 * @param render 渲染器
 * @param program 着色器程序
 */
export function loadVertexBuffer(
  render: WebGLRender,
  program: WebGLProgram,
  imageSource?: TexImageSource | ArrayBufferView
) {
  // 顶点坐标
  loadPositionBuffer(render, program);
  // 贴图
  const cubeTexTure = loadTextureBuffer(render, program, imageSource);
  // 顶点索引
  loadIndexBuffer(render);
  return cubeTexTure;
}

/**创建纹理贴图 */
export function loadTextureBuffer(
  render: WebGLRender,
  program: WebGLProgram,
  imageSource?: TexImageSource | ArrayBufferView | ArrayBufferView
) {
  // 加载纹理对象
  imageSource = imageSource || ($$("#logo") as HTMLImageElement);
  const cubeTexTure = render.create2DTexture(
    {
      level: 0,
      internalformat: TexImage2DInternalformat.RGBA,
      type: TexImage2DTexelType.UNSIGNED_BYTE,
      imageSource,
    },
    render.getTexParamNotPowerOf2()
  );
  // 设置纹理坐标缓冲
  const frantCoor = [0, 0, 1, 0, 1, 1, 0, 1]; // 每两个点为一个矩形四个点的取值范围坐标
  const backCoor = frantCoor; // 这里六个面都设置一样的贴图
  const topCoor = frantCoor;
  const bottomCoor = frantCoor;
  const rightCoor = frantCoor;
  const leftCoor = frantCoor;
  const textureCoordinates: number[] = [].concat(
    frantCoor,
    backCoor,
    topCoor,
    bottomCoor,
    rightCoor,
    leftCoor
  );
  render.createArrayBuffer(
    {
      data: new Float32Array(textureCoordinates),
      usage: WebGLBufferUsage.STATIC_DRAW,
    },
    [
      {
        index: render.getAttribLocation(program, "aTextureCoord"),
        size: 2,
        type: WebGLVertexDataType.FLOAT,
        normalized: false,
        stride: 0,
        offset: 0,
      },
    ]
  );
  return cubeTexTure;
}

/**
 * 更新采样器 uSampler 的值
 */
export function loadUniform_uSampler(
  render: WebGLRender,
  program: WebGLProgram,
  cubeTexTure: WebGLTexture
) {
  // 绑定纹理对象
  const gl = render.gl;
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, cubeTexTure);
  // 更新 uSampler 的值
  const uSampleLoc = render.getUniformLocation(program, "uSampler");
  gl.uniform1i(uSampleLoc, 0);
}

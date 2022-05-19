import { $$ } from "../utils/xml";
import { WebGLRender } from "../webgl/WebGLRender";
import { initCanvas, loadUniform } from "./2.drawingASquare";
import { requestAnimationFrameDraw } from "./4.drawingAAnimatingSquare";
import { draw, loadIndexBuffer, loadPositionBuffer } from "./5.drawingACube";
import {
  createProgram,
  loadTextureBuffer,
  loadUniform_uSampler,
} from "./6.usingTextureOnCube";

/**
 * 在立方体上使用视频纹理对象
 */
export function usingVedioTextureOnCube() {
  const url = "src/assets/drryg-tjfm9.mp4";
  requestAnimationFrameDraw((radian) => {
    drawingACube(radian, url);
  }, 1);
}

/**
 * 绘制一个带视频纹理的立方体
 */
export function drawingACube(radian: number, url: string) {
  // 构建渲染器
  const render = new WebGLRender($$("#glcanvas") as HTMLCanvasElement);
  const gl = render.gl;
  // 初始化画布
  initCanvas(gl);
  // 创建着色器程序
  const program = createProgram(render);
  // 创建顶点缓冲并关联顶点属性
  const cubeTexTure = loadVertexBuffer(render, program, url);
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
 * 创建顶点缓冲并关联顶点属性
 * @param render 渲染器
 * @param program 着色器程序
 */
export function loadVertexBuffer(
  render: WebGLRender,
  program: WebGLProgram,
  url: string
) {
  // 顶点坐标
  loadPositionBuffer(render, program);
  // 贴图
  const cubeTexTure = loadVedioTextureBuffer(render, program, url);
  // 顶点索引
  loadIndexBuffer(render);
  return cubeTexTure;
}

let video: HTMLVideoElement = null;
let copyVideo = false;
/**创建 video 纹理贴图 */
export function loadVedioTextureBuffer(
  render: WebGLRender,
  program: WebGLProgram,
  url: string
) {
  loadVedio(url);
  return loadTextureBuffer(render, program, copyVideo ? video : null);
}

/**加载 Video */
function loadVedio(url: string) {
  if (video) {
    return;
  }
  video = document.createElement("video");
  // 自动静音循环播放
  video.autoplay = true;
  video.muted = true;
  video.loop = true;

  // 状态监听
  var playing = false;
  var timeupdate = false;
  video.addEventListener(
    "playing",
    function () {
      playing = true;
      checkReady();
    },
    true
  );

  video.addEventListener(
    "timeupdate",
    function () {
      timeupdate = true;
      checkReady();
    },
    true
  );

  video.src = url;
  video.play();

  function checkReady() {
    if (playing && timeupdate) {
      copyVideo = true;
    }
  }
}

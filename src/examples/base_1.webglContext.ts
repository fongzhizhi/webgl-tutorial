import { $$ } from "../utils/xml";

/**
 * 获取webgl渲染上下文
 */
export function getWebGLContext() {
  const canvas = $$("#glcanvas") as HTMLCanvasElement;
  /**WebGl上下文 */
  const gl = canvas && canvas.getContext("webgl");
  if (!gl) {
    alert("无法初始化WebGL，你的浏览器、操作系统或硬件等可能不支持WebGL。");
    return;
  }
  // 使用完全不透明淡蓝色清除所有图像
  gl.clearColor(0, 0.74, 0.83, 1);
  // 用上面指定的颜色清除缓冲区
  gl.clear(gl.COLOR_BUFFER_BIT);
  return gl;
}

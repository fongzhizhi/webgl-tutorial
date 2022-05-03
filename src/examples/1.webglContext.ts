import { $$ } from "../utils/xml";

/**
 * 获取webgl渲染上下文
 */
export function getWebGLContext() {
  const canvas = $$("#glcanvas") as HTMLCanvasElement;
  /**WebGl上下文 */
  const glContext = canvas && canvas.getContext("webgl");
  if (!glContext) {
    alert("无法初始化WebGL，你的浏览器、操作系统或硬件等可能不支持WebGL。");
    return;
  }
  // 使用完全不透明的黑色清除所有图像
  glContext.clearColor(0, 0, 0, 1);
  // 用上面指定的颜色清除缓冲区
  glContext.clear(glContext.COLOR_BUFFER_BIT);
}

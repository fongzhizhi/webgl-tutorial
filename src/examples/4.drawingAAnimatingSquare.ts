import { DrawAnimationFrame } from "../app/public";
import { drawingASquareOfColor } from "./3.drawingASquareOfColor";

/**
 * 绘制一个运动的正方形
 */
export function drawingAAnimatingSquare() {
  requestAnimationFrameDraw(drawingASquareOfColor);
}

/**
 * 按帧执行渲染函数
 * @param drawFun 绘制逻辑函数
 * @param speed 旋转速度
 */
export function requestAnimationFrameDraw(
  drawFun: (radian: number) => void,
  speed = 1.5
) {
  /**上一刻 */
  let last = window.performance.now() / 1000;
  /**旋转弧度 */
  let radian = 0;

  /**
   * 帧渲染函数
   * @param now 当前时刻(1000s)
   */
  function render(now: number) {
    now = now / 1000; // 转为ms
    const deltaTime = now - last; // 经过的时间
    radian += deltaTime * speed; // 随时间变化更新旋转弧度
    last = now;
    drawFun(radian);
    DrawAnimationFrame.index = requestAnimationFrame(render);
  }

  DrawAnimationFrame.index = requestAnimationFrame(render);
}

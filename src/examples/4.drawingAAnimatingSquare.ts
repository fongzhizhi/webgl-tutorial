import { drawingASquareOfColor } from "./3.drawingASquareOfColor";

/**
 * 绘制一个运动的正方形
 */
export function drawingAAnimatingSquare() {
  requestAnimationFrame(render);
}

/**上一刻 */
let last = window.performance.now() / 1000;
/**旋转弧度 */
let radian = 0;
/**旋转速度 */
const speed = 2;
/**
 * 渲染
 * @param now 当前时刻(1000s)
 */
function render(now: number) {
  now = now / 1000; // 转为ms
  const deltaTime = now - last; // 经过的时间
  radian += deltaTime * speed; // 随时间变化更新旋转弧度
  last = now;
  drawingASquareOfColor(radian);
  requestAnimationFrame(render);
}

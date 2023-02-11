import { $$ } from "../utils/xml";
import { BBoxDrawer } from "../webgl/components/BBoxDrawer";
import { initCanvas } from "../webgl/Utils";

/**
 * 通过齐次坐标绘制矩形框
 * @description 验证裁剪空间的裁剪效果
 */
export function drawBBoxsByHomogeneous() {
  const canvas = $$("#glcanvas") as HTMLCanvasElement;
  const drawer = new BBoxDrawer(canvas);
  initCanvas(drawer.render.gl);
  drawer.draw({
    top: 0.5,
    bottom: -0.5,
    left: -0.5,
    right: 0.5,
    depth: 0,
    w: 0.8,
    color: [1, 0.4, 0.4, 1], // red
  });
  drawer.draw({
    top: 0.9,
    bottom: 0,
    left: -0.9,
    right: 0.9,
    depth: 0.5,
    w: 1.3,
    color: [0.4, 1, 0.4, 1], // green
  });
  drawer.draw({
    top: 0.3,
    bottom: -1.7,
    left: -0.2,
    right: 1.7,
    depth: 0.8,
    w: 2,
    color: [0.4, 0.4, 1, 1], // blue
  });
}

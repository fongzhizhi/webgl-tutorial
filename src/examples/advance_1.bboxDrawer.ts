import { $$ } from "../utils/xml";
import { BBoxDrawer } from "../webgl/components/BBoxDrawer";
import { initCanvas } from "../webgl/Utils";

/**
 * 绘制矩形框
 * @description 验证裁剪空间的裁剪效果
 */
export function drawBBoxs() {
  const canvas = $$("#glcanvas") as HTMLCanvasElement;
  const drawer = new BBoxDrawer(canvas);
  initCanvas(drawer.render.gl);
  drawer.draw({
    top: 0.5,
    bottom: -0.5,
    left: -0.5,
    right: 0.5,
    depth: 0,
    color: [1, 0.4, 0.4, 1], // red
  });
  drawer.draw({
    top: 0.9,
    bottom: 0,
    left: -0.9,
    right: 0.9,
    depth: 0.5,
    color: [0.4, 1, 0.4, 1], // green
  });
  drawer.draw({
    top: 0.3,
    bottom: -1.7,
    left: -0.2,
    right: 1.7,
    depth: 0.8,
    color: [0.4, 0.4, 1, 1], // blue
  });
}

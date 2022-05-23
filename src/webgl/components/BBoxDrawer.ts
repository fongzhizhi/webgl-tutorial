import { WebGLRender } from "../WebGLRender";

/**矩形框信息 */
export interface BBoxInfo {
  /**上 */
  top: number;
  /**下 */
  bottom: number;
  /**左 */
  left: number;
  /**右 */
  right: number;
  /**深度(z) */
  depth: number;
  /**rgb色值 */
  color: [number, number, number, number];
}

/**
 * 矩形框绘制器
 */
export class BBoxDrawer {
  /**渲染器 */
  private readonly render: WebGLRender;

  /**
   * WebGL渲染器
   * @param canvas canvas元素
   * @param gl_attributes webgl上下文属性
   */
  constructor(
    canvas: HTMLCanvasElement,
    gl_attributes?: WebGLContextAttributes
  ) {
    this.render = new WebGLRender(canvas, gl_attributes);
  }

  /**
   * 绘制
   */
  draw(bboxInfo: BBoxInfo) {
    // 1.创建着色器程序
    // 2.绑定缓冲数据
    // 3.更新uniform属性
    // 4.执行绘制
  }
}

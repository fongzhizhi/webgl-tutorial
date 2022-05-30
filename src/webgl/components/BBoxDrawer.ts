import {
  BufferOption,
  VertexAttrOption,
  WebGLBufferUsage,
  WebGLDrawType,
  WebGLVertexDataType,
} from "../Constants";
import { WebGLRender } from "../WebGLRender";

/**[程序属性] - 顶点坐标 */
const a_position = "a_position";
/**[统一变量] - 片段颜色 */
const u_color = "u_color";

/**顶点着色器源码 */
const vs = `
    attribute vec4 ${a_position};

    void main() {
      gl_Position = ${a_position};
    }
`;
/**片段着色器源码 */
const fs = `
    precision mediump float;
    uniform vec4 ${u_color};

    void main() {
      gl_FragColor = ${u_color};
    }
`;

/**rgb色值 */
type RGBColor = [number, number, number, number];

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
  /**第四位向量分量值 */
  w?: number;
  /**rgb色值 */
  color: RGBColor;
}

/**
 * 矩形框绘制器
 */
export class BBoxDrawer {
  /**渲染器 */
  readonly render: WebGLRender;

  /**
   * 矩形框绘制器
   * @param canvas canvas元素
   * @param gl_attributes webgl上下文属性
   * @space 裁剪空间
   */
  constructor(
    canvas: HTMLCanvasElement,
    gl_attributes?: WebGLContextAttributes
  ) {
    this.render = new WebGLRender(canvas, gl_attributes);
  }

  /**创建着色器程序 */
  private creatProgram() {
    return this.render.createProgramBySource(vs, fs);
  }

  /**绑定缓冲数据 */
  private loadBuffer(program: WebGLProgram, points: number[]) {
    // 顶点坐标
    const bufferOpt: BufferOption = {
      data: new Float32Array(points),
      usage: WebGLBufferUsage.STATIC_DRAW,
    };
    const attrOpt: VertexAttrOption = {
      index: this.render.getAttribLocation(program, a_position),
      size: 4,
      type: WebGLVertexDataType.FLOAT,
      normalized: false,
      stride: 0,
      offset: 0,
    };
    return this.render.createArrayBuffer(bufferOpt, attrOpt);
  }

  /**
   * 更新uniform属性
   */
  private updateUniform(
    program: WebGLProgram,
    uniforms: {
      /**片段颜色 */
      color: RGBColor;
    }
  ) {
    const render = this.render;
    const gl = render.gl;
    gl.useProgram(program);
    gl.uniform4fv(render.getUniformLocation(program, u_color), uniforms.color);
  }

  /**
   * 渲染
   */
  private rendering() {
    const gl = this.render.gl;
    gl.drawArrays(gl[WebGLDrawType.TRIANGLE_STRIP], 0, 4);
  }

  /**
   * 绘制
   */
  draw(bboxInfo: BBoxInfo) {
    // 1.创建着色器程序
    const program = this.creatProgram();
    // 2.绑定缓冲数据
    const { left, bottom, right, top, depth, w = 1, color } = bboxInfo;
    const points: number[] = [].concat(
      [left, bottom, depth, w],
      [right, bottom, depth, w],
      [left, top, depth, w],
      [right, top, depth, w]
    );
    this.loadBuffer(program, points);
    // 3.更新uniform属性
    this.updateUniform(program, {
      color,
    });
    // 4.渲染到画布
    this.rendering();
  }
}

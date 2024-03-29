import basicVS from "../glsl/basicVS.glsl?raw";
import basicFs from "../glsl/basicFS.glsl?raw";
import {
  RenderpProgramConfig,
  WebGLVertexDataType,
} from "../../webgl/Constants";
import { WebGLRender } from "../../webgl/WebGLRender";
import { Render } from "./Render";

/**unifroms数据 */
export interface BasicUniformData {
  /**模型视图投影矩阵{mat4} */
  mvpMatrix: Iterable<number>;
}

/**
 * 使用basiVS和basicFS着色器进行渲染
 */
export function basicRender(opt: {
  /**获取顶点数据[position{vec3}, color{vec3} */
  getVertexs: () => number[];
  /**获取Elements索引 */
  getElementIndexs?: () => number[];
  /**获取uniform数据 */
  getUniforms: (render?: WebGLRender) => BasicUniformData;
  /**执行绘制 */
  draw: (render: WebGLRender, count: number) => void;
}) {
  // 渲染程序
  const bytesPerElement = 4;
  const arrayStride = 6;
  const stride = arrayStride * bytesPerElement;
  let offset = 0;
  const renderConfig: RenderpProgramConfig = {
    vertex: {
      code: basicVS,
      desc: {
        arrayStride,
        attributes: [
          {
            index: "a_Position",
            size: 3,
            type: WebGLVertexDataType.FLOAT,
            normalized: false,
            stride,
            offset,
          },
          {
            index: "a_Color",
            size: 3,
            type: WebGLVertexDataType.FLOAT,
            normalized: false,
            stride,
            offset: (offset += 3 * bytesPerElement),
          },
        ],
      },
    },
    fragment: {
      code: basicFs,
      desc: {
        attributes: [
          {
            location: "u_MvpMatrix",
            desc: {
              format: "mat",
              unitSize: 4,
            },
          },
        ],
      },
    },
  };

  return Render({
    renderConfig,
    getVertexs: opt.getVertexs,
    getElementIndexs: opt.getElementIndexs,
    getUniforms: (render) => [opt.getUniforms(render).mvpMatrix],
    draw: opt.draw,
  });
}

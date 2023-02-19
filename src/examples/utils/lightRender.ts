import lightVS from "../glsl/lightVS.glsl?raw";
import basicFs from "../glsl/basicFS.glsl?raw";
import {
  RenderpProgramConfig,
  WebGLVertexDataType,
} from "../../webgl/Constants";
import { WebGLRender } from "../../webgl/WebGLRender";
import { Render } from "./Render";

/**unifroms数据 */
export interface LightUniformData {
  /**模型视图投影矩阵{mat4} */
  mvpMatrix: Iterable<number>;
  /**平行光颜色{vec3} */
  lightColor: Iterable<number>;
  /**平行光方向(归一化){vec3} */
  lightDirection: Iterable<number>;
  /**环境光颜色{vec3} */
  ambientLight: Iterable<number>;
}

/**
 * 使用lightVS和basicFS着色器进行光照效果渲染
 */
export function lightRender(opt: {
  /**获取顶点数据[position{vec3}, color{vec3}, normal{vec3}] */
  getVertexs: () => number[];
  /**获取Elements索引 */
  getElementIndexs?: () => number[];
  /**获取uniform数据 */
  getUniforms: (render?: WebGLRender) => LightUniformData;
  /**执行绘制 */
  draw: (render: WebGLRender, count: number) => void;
}) {
  // 渲染程序
  const bytesPerElement = 4;
  const arrayStride = 9;
  const stride = arrayStride * bytesPerElement;
  let offset = 0;
  const renderConfig: RenderpProgramConfig = {
    vertex: {
      code: lightVS,
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
          {
            index: "a_Normal",
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
          {
            location: "u_LightColor",
            desc: {
              format: "float",
              unitSize: 3,
            },
          },
          {
            location: "u_LightDirection",
            desc: {
              format: "float",
              unitSize: 3,
            },
          },
          {
            location: "u_AmbientLight",
            desc: {
              format: "float",
              unitSize: 3,
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
    getUniforms,
    draw: opt.draw,
  });

  function getUniforms(render: WebGLRender) {
    const uniformMap = opt.getUniforms(render);
    return [
      uniformMap.mvpMatrix,
      uniformMap.lightColor,
      uniformMap.lightDirection,
      uniformMap.ambientLight,
    ];
  }
}

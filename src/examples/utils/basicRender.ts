import basicVS from "../glsl/basicVS.glsl?raw";
import basicFs from "../glsl/basicFS.glsl?raw";
import { $$ } from "../../utils/xml";
import {
  RenderpProgramConfig,
  WebGLVertexDataType,
  UniformData,
  WebGLBufferType,
} from "../../webgl/Constants";
import { WebGLRender } from "../../webgl/WebGLRender";
import {
  getVertexAttrOption,
  initCanvas,
  initProgram,
  loadUniforms,
  loadVertexBuffer,
} from "../../webgl/Utils";
import { DrawAnimationFrame } from "../../app/public";

/**unifroms数据 */
export interface BasicUniformData {
  /**模型视图投影矩阵 */
  mvpMatrix: Iterable<number>;
}

/**
 * 使用basiVS和basicFS着色器进行渲染
 */
export function basicRender(opt: {
  /**获取顶点数据[position vec3, color vec3] */
  getVertexs: () => number[];
  /**获取Elements索引 */
  getElementIndexs?: () => number[];
  /**获取uniform数据 */
  getUniforms: (render?: WebGLRender) => BasicUniformData;
  /**执行绘制 */
  draw: (render: WebGLRender, count: number) => void;
}) {
  const render = new WebGLRender($$("#glcanvas") as HTMLCanvasElement);

  // 渲染程序
  const bytesPerElement = 4;
  const arrayStride = 6;
  const stride = arrayStride * bytesPerElement;
  let offset = 0;
  const renderConfig: RenderpProgramConfig = {
    vertex: {
      code: basicVS,
      desc: {
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
    },
  };

  // 渲染数据
  const vertexs = opt.getVertexs();
  const indexs = opt.getElementIndexs && opt.getElementIndexs();

  // 程序初始化
  initCanvas(render.gl);
  const program = initProgram(render, renderConfig);
  if (!program) {
    return;
  }

  // 更新顶点缓冲
  const attrOpts = getVertexAttrOption(render, program, renderConfig);
  loadVertexBuffer(
    render,
    new Float32Array(vertexs),
    attrOpts,
    WebGLBufferType.ARRAY_BUFFER
  );
  indexs &&
    loadVertexBuffer(
      render,
      new Uint8Array(indexs),
      undefined,
      WebGLBufferType.ELEMENT_ARRAY_BUFFER
    );
  // 渲染
  function rend() {
    // 更新uniform缓冲
    const uniforms = getUniforms(opt.getUniforms(render).mvpMatrix);
    loadUniforms(render, program, uniforms);
    // 执行绘制
    opt.draw(render, indexs ? indexs.length : vertexs.length / arrayStride);
    DrawAnimationFrame.index = requestAnimationFrame(rend);
  }
  DrawAnimationFrame.index = requestAnimationFrame(rend);
}

function getUniforms(mvpMatrix: Iterable<number>) {
  const uniformDatas: UniformData[] = [
    {
      location: "u_MvpMatrix",
      data: mvpMatrix,
      desc: {
        format: "mat",
        unitSize: 4,
      },
    },
  ];
  return uniformDatas;
}

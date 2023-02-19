import { $$ } from "../utils/xml";
import {
  RenderpProgramConfig,
  UniformData,
  WebGLVertexDataType,
} from "../webgl/Constants";
import { WebGLRender } from "../webgl/WebGLRender";
import circleVS from "./glsl/circleVS_02.glsl?raw";
import circleFS from "./glsl/circleFS_02.glsl?raw";
import {
  getMvpMatrix,
  initCanvas,
  initProgram,
  loadUniforms,
  getVertexAttrOption,
  loadVertexBuffer,
} from "../webgl/Utils";

export function drawAFullCircle2() {
  const render = new WebGLRender($$("#glcanvas") as HTMLCanvasElement);
  // 数据与相关配置
  const bytesPerElement = 4;
  const arrayStride = 4; // [index, position * 2, radius]
  const stride = arrayStride * bytesPerElement;
  let offset = 0;
  const renderConfig: RenderpProgramConfig = {
    vertex: {
      code: circleVS,
      desc: {
        arrayStride,
        attributes: [
          {
            index: "a_Index",
            size: 1,
            type: WebGLVertexDataType.FLOAT,
            normalized: false,
            stride,
            offset: offset,
          },
          {
            index: "a_Center",
            size: 2,
            type: WebGLVertexDataType.FLOAT,
            normalized: false,
            stride,
            offset: (offset += 1 * bytesPerElement),
          },
          {
            index: "a_Radius",
            size: 1,
            type: WebGLVertexDataType.FLOAT,
            normalized: false,
            stride,
            offset: (offset += 2 * bytesPerElement),
          },
        ],
      },
    },
    fragment: {
      code: circleFS,
      desc: {
        attributes: [],
      },
    },
  };
  // 渲染数据
  const vertexData = [0, 0, 0, 1, 1, 0, 0, 1, 2, 0, 0, 1];

  const uniformDatas: UniformData[] = [
    {
      location: "u_MvpMatrix",
      data: getMvpMatrix(render.gl),
      desc: {
        format: "mat",
        unitSize: 4,
      },
    },
  ];
  initCanvas(render.gl);
  // 程序初始化
  const program = initProgram(render, renderConfig);
  if (!program) {
    return;
  }
  // 更新uniform
  loadUniforms(render, program, uniformDatas);

  // 更新顶点缓冲
  const attrOpts = getVertexAttrOption(render, program, renderConfig);
  loadVertexBuffer(render, new Float32Array(vertexData), attrOpts);

  // 执行绘制
  draw(render, vertexData.length / arrayStride);
}

/**执行绘制 */
function draw(render: WebGLRender, count: number) {
  const gl = render.gl;
  gl.drawArrays(gl.TRIANGLES, 0, count);
}

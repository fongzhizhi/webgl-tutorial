import { $$ } from "../utils/xml";
import {
  RenderpProgramConfig,
  UniformData,
  WebGLVertexDataType,
} from "../webgl/Constants";
import { WebGLRender } from "../webgl/WebGLRender";
import circleVS from "./glsl/circleVS.glsl?raw";
import circleFS from "./glsl/circleFS.glsl?raw";
import {
  getMvpMatrix,
  initCanvas,
  initProgram,
  loadUniforms,
  getVertexAttrOption,
  loadVertexBuffer,
} from "../webgl/Utils";

export function drawAFullCircle() {
  const render = new WebGLRender($$("#glcanvas") as HTMLCanvasElement);
  // 数据与相关配置
  const bytesPerElement = 4;
  const arrayStride = 3; // [position * 2, radius]
  const stride = arrayStride * bytesPerElement;
  const renderConfig: RenderpProgramConfig = {
    vertex: {
      code: circleVS,
      desc: {
        attributes: [
          {
            index: "a_Position",
            size: 2,
            type: WebGLVertexDataType.FLOAT,
            normalized: false,
            stride,
            offset: 0,
          },
          {
            index: "a_Radius",
            size: 1,
            type: WebGLVertexDataType.FLOAT,
            normalized: false,
            stride,
            offset: 2 * bytesPerElement,
          },
        ],
      },
    },
    fragment: {
      code: circleFS,
    },
  };
  // 渲染数据
  const vertexData = [0, 0, 100];

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
  gl.drawArrays(gl.POINTS, 0, count);
}

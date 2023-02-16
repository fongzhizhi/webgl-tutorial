import { $$ } from "../utils/xml";
import {
  RenderpProgramConfig,
  WebGLVertexDataType,
  UniformData,
} from "../webgl/Constants";
import {
  getMvpMatrix,
  initCanvas,
  initProgram,
  loadUniforms,
  getVertexAttrOption,
  loadVertexBuffer,
} from "../webgl/Utils";
import { WebGLRender } from "../webgl/WebGLRender";
import VS from "./glsl/strokeLineVS.glsl?raw";
import FS from "./glsl/strokeLineFS.glsl?raw";

/**绘制线段 */
export function drawALine() {
  const render = new WebGLRender($$("#glcanvas") as HTMLCanvasElement);
  // 渲染程序
  const bytesPerElement = 4;
  const arrayStride = 6;
  const stride = arrayStride * bytesPerElement;
  let offset = 0;
  const renderConfig: RenderpProgramConfig = {
    vertex: {
      code: VS,
      desc: {
        attributes: [
          {
            index: "a_start_end",
            size: 4,
            type: WebGLVertexDataType.FLOAT,
            normalized: false,
            stride,
            offset,
          },
          {
            index: "a_params",
            size: 2,
            type: WebGLVertexDataType.FLOAT,
            normalized: false,
            stride,
            offset: (offset += 4 * bytesPerElement),
          },
        ],
      },
    },
    fragment: {
      code: FS,
    },
  };
  // 渲染数据
  const vertexData = getVertexs({
    start: [-0.5, -0.5],
    end: [0.8, 0.8],
    stroke: 1,
  });

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

/**获取顶点数据 */
function getVertexs(opt: {
  /**起点 */
  start: [number, number];
  /**终点 */
  end: [number, number];
  /**线宽 */
  stroke: number;
}) {
  // [a_start_end<vec4>, a_params<vec2~[index, stroke]>];
  const vertexData: number[] = [];
  for (let i = 0; i < 4; i++) {
    vertexData.push(
      opt.start[0],
      opt.start[1],
      opt.end[0],
      opt.end[1],
      i,
      opt.stroke
    );
  }
  return vertexData;
}

function draw(render: WebGLRender, n: number) {
  render.gl.drawArrays(render.gl.TRIANGLE_STRIP, 0, n);
}

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
import basicVS from "./glsl/basicVS.glsl?raw";
import basicFs from "./glsl/basicFS.glsl?raw";

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
  const vertexData = getVertexs();

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
function getVertexs() {
  // [a_start_end<vec4>, a_params<vec3~[index, stroke, radius]>, a_color<vec3>];
  const vertexData: number[] = [];
  pushPoint(vertexData, -1, 0.5);
  pushPoint(vertexData, -1, -0.5);
  pushPoint(vertexData, 1, 0.5);
  pushPoint(vertexData, 1, -0.5);
  return vertexData;

  function pushPoint(vertexData: number[], x: number, y: number) {
    const r = Math.abs(x);
    const g = Math.abs(y);
    const b = Math.abs(x + y);
    vertexData.push(x, y, 1, r, g, b);
  }
}

function draw(render: WebGLRender, n: number) {
  render.gl.drawArrays(render.gl.TRIANGLE_STRIP, 0, n);
}

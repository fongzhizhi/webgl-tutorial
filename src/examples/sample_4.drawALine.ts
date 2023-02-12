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
  const center = [0, 0]; // 圆心
  const radius = 1; // 半径
  const whole = 2 * Math.PI;
  const step = whole / 50;
  // [positin * 3, color * 3]
  const vertexData: number[] = [];
  // pushPoint(vertexData, center[0], center[1]);
  for (let a = 0; a < whole + step; a += step) {
    const x = center[0] + radius * Math.cos(a);
    const y = center[1] + radius * Math.sin(a);
    pushPoint(vertexData, x, y);
  }
  return vertexData;

  function pushPoint(vertexData: number[], x: number, y: number) {
    const r = Math.abs(x);
    const g = Math.abs(y);
    const b = Math.abs(x + y);
    vertexData.push(x, y, 1, r, g, b);
  }
}

function draw(render: WebGLRender, n: number) {
  render.gl.drawArrays(render.gl.LINE_STRIP, 0, n);
}

import { $$ } from "../../utils/xml";
import {
  RenderpProgramConfig,
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

/**
 * 渲染器
 */
export function Render(opt: {
  /**渲染参数 */
  renderConfig: RenderpProgramConfig;
  /**获取顶点数据 */
  getVertexs: () => number[];
  /**获取Elements索引 */
  getElementIndexs?: () => number[];
  /**获取uniform数据 */
  getUniforms: (render?: WebGLRender) => Iterable<number>[];
  /**执行绘制 */
  draw: (render: WebGLRender, count: number) => void;
}) {
  const render = new WebGLRender($$("#glcanvas") as HTMLCanvasElement);

  // 渲染程序
  const renderConfig = opt.renderConfig;

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
    const uniforms = getUniforms(opt.getUniforms(render), renderConfig);
    loadUniforms(render, program, uniforms);
    // 执行绘制
    opt.draw(
      render,
      indexs
        ? indexs.length
        : vertexs.length / renderConfig.vertex.desc.arrayStride
    );
    DrawAnimationFrame.index = requestAnimationFrame(rend);
  }
  DrawAnimationFrame.index = requestAnimationFrame(rend);
}

/**获取unifrom配置信息 */
function getUniforms(
  uniforms: Iterable<number>[],
  config: RenderpProgramConfig
) {
  const uniformDatas: UniformData[] = [];
  const uniformAttrs = config.fragment.desc.attributes;
  (uniforms || []).forEach((data, i) => {
    const attr = uniformAttrs[i];
    if (!attr) {
      console.error("Has no unifroms desc on RenderpProgramConfig!");
      return;
    }
    uniformDatas.push({
      location: attr.location,
      data,
      desc: attr.desc,
    });
  });
  return uniformDatas;
}

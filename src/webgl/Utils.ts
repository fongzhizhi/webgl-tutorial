import { mat4, vec3, vec4 } from "gl-matrix";
import {
  RenderpProgramConfig,
  UniformData,
  VertexAttrOption,
  WebGLBufferUsage,
} from "./Constants";
import { WebGLRender } from "./WebGLRender";

/**
 * 3维坐标转齐次坐标
 * @param v 三维向量
 */
export function cartesianToHomogeneous(v: vec3, w = 1): vec4 {
  return [v[0], v[1], v[2], w];
}

/**
 * 齐次坐标转三维坐标
 * @param v 四维向量
 */
export function homogeneousToCartesian(v: vec4): vec3 {
  const w = v[3];
  return [v[0] / w, v[1] / w, v[2] / w];
}

/**初始化画布状态 */
export function initCanvas(gl: WebGLRenderingContext) {
  gl.clearColor(0.3, 0.3, 0.3, 1); // 使用完全不透明的灰色清除所有图像
  gl.clearDepth(1); // 清空所有图元
  gl.enable(gl.DEPTH_TEST); // 启用深度测试
  gl.depthFunc(gl.LEQUAL); // 指定深度比较函数
  gl.clear(gl.COLOR_BUFFER_BIT); // 清空画布
}

/**初始化程序 */
export function initProgram(
  render: WebGLRender,
  renderConfig: RenderpProgramConfig
) {
  return render.createProgramBySource(
    renderConfig.vertex.code,
    renderConfig.fragment.code
  );
}

/**加载uniform数据 */
export function loadUniforms(
  render: WebGLRender,
  program: WebGLProgram,
  uniformDatas?: UniformData[]
) {
  const gl = render.gl;
  gl.useProgram(program); // 将程序添加到渲染状态(此状态开启后，才能关联uniform属性)
  uniformDatas &&
    uniformDatas.forEach((item) => {
      const { data, desc, location } = item;
      const loc =
        typeof location === "string"
          ? render.getUniformLocation(program, location)
          : location;
      switch (desc.format) {
        case "float":
          if (desc.unitSize === 1) {
            gl.uniform1fv(loc, data);
          } else if (desc.unitSize === 2) {
            gl.uniform2fv(loc, data);
          } else if (desc.unitSize === 3) {
            gl.uniform3fv(loc, data);
          } else if (desc.unitSize === 4) {
            gl.uniform4fv(loc, data);
          }
          break;
        case "int":
          if (desc.unitSize === 1) {
            gl.uniform1iv(loc, data);
          } else if (desc.unitSize === 2) {
            gl.uniform2iv(loc, data);
          } else if (desc.unitSize === 3) {
            gl.uniform3iv(loc, data);
          } else if (desc.unitSize === 4) {
            gl.uniform4iv(loc, data);
          }
          break;
        case "mat":
          if (desc.unitSize === 2) {
            gl.uniformMatrix2fv(loc, !!desc.transpose, data);
          } else if (desc.unitSize === 3) {
            gl.uniformMatrix3fv(loc, !!desc.transpose, data);
          } else if (desc.unitSize === 4) {
            gl.uniformMatrix4fv(loc, !!desc.transpose, data);
          }
          break;
      }
    });
}

/**获取顶点属性参数 */
export function getVertexAttrOption(
  render: WebGLRender,
  program: WebGLProgram,
  renderConfig: RenderpProgramConfig
) {
  return renderConfig.vertex.desc.attributes.map((item) => {
    if (typeof item.index === "string") {
      item.index = render.getAttribLocation(program, item.index);
    }
    return item;
  });
}

/**
 * 加载顶点缓冲数据
 * @param render 渲染器
 * @param buffer 顶点缓冲
 */
export function loadVertexBuffer(
  render: WebGLRender,
  buffer: BufferSource,
  attrOpts?: VertexAttrOption[]
) {
  render.createArrayBuffer(
    {
      data: buffer,
      usage: WebGLBufferUsage.STATIC_DRAW,
    },
    attrOpts
  );
}

/**
 * 获取视图模型投影矩阵
 * @param gl
 * @param opt
 */
export function getMvpMatrix(
  gl: WebGLRenderingContext,
  opt?: {
    radian: Partial<{
      x: number;
      y: number;
      z: number;
    }>;
  }
) {
  // 投影
  const projectionMatrix = mat4.create();
  const fieldOfView = (45 * Math.PI) / 180;
  const canvas = gl.canvas as HTMLCanvasElement;
  const aspect = canvas.clientWidth / canvas.clientHeight;
  const zNear = 0.1;
  const zFar = 100.0;
  mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

  // 模型
  const modelViewMatrix = mat4.create();
  mat4.translate(modelViewMatrix, modelViewMatrix, [-0.0, 0.0, -6.0]);
  const radian = opt?.radian;
  if (radian) {
    !isNaN(radian.x) &&
      mat4.rotate(modelViewMatrix, modelViewMatrix, radian.x, [1, 0, 0]); // 绕 x 轴旋转
    !isNaN(radian.y) &&
      mat4.rotate(modelViewMatrix, modelViewMatrix, radian.y, [0, 1, 0]); // 绕 y 轴旋转
    !isNaN(radian.z) &&
      mat4.rotate(modelViewMatrix, modelViewMatrix, radian.z, [0, 0, 1]); // 绕 z 轴旋转
  }
  return mat4.multiply(projectionMatrix, projectionMatrix, modelViewMatrix);
}

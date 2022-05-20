import {
  BufferOption,
  WebGLBufferUsage,
  WebGLShaderType,
  VertexAttrOption,
  WebGLBufferType,
  TexImage2DInternalformat,
  TexImage2DTexelType,
  TexParameter_Min_Filter,
  TexParameter_Mag_Filter,
  TexParameter_Wrap_ST,
  TexParam,
  texImage2DOption,
} from "./Constants";

/**
 * WebGL渲染器
 * @description WebGL绘图上下文相关API的封装
 */
export class WebGLRender {
  /**画布容器 */
  readonly canvas: HTMLCanvasElement;
  /**上下文属性 */
  readonly gl_attributes: WebGLContextAttributes;
  /**上下文 */
  readonly gl: WebGLRenderingContext;

  /**
   * WebGL渲染器
   * @param canvas canvas元素
   * @param gl_attributes webgl上下文属性
   */
  constructor(
    canvas: HTMLCanvasElement,
    gl_attributes?: WebGLContextAttributes
  ) {
    this.canvas = canvas;
    this.gl_attributes = gl_attributes || {
      depth: false,
      antialias: false,
      stencil: false,
      alpha: false,
      premultipliedAlpha: false,
    };
    this.gl = canvas.getContext("webgl", gl_attributes);
  }

  /**
   * 创建着色器
   * @param type 着色器类型
   * @param source 着色器FGSL程序源码
   */
  createShader(type: WebGLShaderType, source: string) {
    const gl = this.gl;
    // 创建着色器
    const shader = gl.createShader(gl[type]);
    if (!shader) {
      throw new Error("invalid shader type: " + type);
    }
    // 挂在源码并编译
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    // 检测是否编译成功
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const info = gl.getShaderInfoLog(shader);
      gl.deleteShader(shader);
      throw new Error("An error occurred compiling the shaders: " + info);
    }

    return shader;
  }

  /**
   * 创建着色器程序
   * @param vs 顶点着色器
   * @param fs 片段着色器
   */
  createProgram(vs: WebGLShader, fs: WebGLShader) {
    const gl = this.gl;

    // 创建WebGL程序
    const program = gl.createProgram();

    // 添加预先定义好的着色器
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);

    // 链接程序，从而完成该程序的顶点着色器和片段着色器准备GPU代码的过程
    gl.linkProgram(program);

    // 判断程序是否可用
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      const info = gl.getProgramInfoLog(program);
      throw "WebGL program compile failed! \n\n" + info;
    }

    return program;
  }

  /**
   * 创建着色器程序
   * @param vs_source 顶点着色器源码
   * @param fs_source 片段着色器源码
   */
  createProgramBySource(vs_source: string, fs_source: string) {
    const vs = this.createShader(WebGLShaderType.VERTEX_SHADER, vs_source);
    const fs = this.createShader(WebGLShaderType.FRAGMENT_SHADER, fs_source);
    return this.createProgram(vs, fs);
  }

  /**
   * 获取指定程序中某属性的下标指向位置
   * @param program 程序
   * @param name 属性名
   */
  getAttribLocation(program: WebGLProgram, name: string) {
    const loc = this.gl.getAttribLocation(program, name);
    if (loc < 0) {
      throw new Error(`Location of attribute ${name} failed to obtain`);
    }
    return loc;
  }

  /**
   * 获取统一变量指向位置
   * @param program 程序
   * @param name 变量名
   */
  getUniformLocation(program: WebGLProgram, name: string) {
    const loc = this.gl.getUniformLocation(program, name);
    if (!loc) {
      throw new Error(`Location of uniform ${name} failed to obtain`);
    }
    return loc;
  }

  /**
   * 创建缓冲
   */
  createBuffer(bufferOpt: BufferOption, bufferType: WebGLBufferType) {
    const gl = this.gl;
    // 创建缓冲
    const buffer = gl.createBuffer();
    // 绑定缓冲并写入数据
    const type = gl[bufferType];
    gl.bindBuffer(type, buffer);
    const usage = gl[bufferOpt.usage];
    if (bufferOpt.data) {
      gl.bufferData(type, bufferOpt.data, usage);
    } else if (bufferOpt.size) {
      gl.bufferData(type, bufferOpt.size, usage);
    }
  }

  /**
   * 创建顶点属性缓冲
   */
  createArrayBuffer(bufferOpt: BufferOption, attrOpt?: VertexAttrOption) {
    bufferOpt = Object.assign(
      {
        usage: WebGLBufferUsage.STATIC_DRAW,
      },
      bufferOpt
    );
    const gl = this.gl;
    // 创建缓冲
    const buffer = this.createBuffer(bufferOpt, WebGLBufferType.ARRAY_BUFFER);
    // 与属性建立关联
    attrOpt && this.vertexAttribPointer(attrOpt);
    return buffer;
  }

  /**
   * 顶点数据与属性建立关联
   */
  vertexAttribPointer(attrOpt: VertexAttrOption) {
    const gl = this.gl;
    // 读取数据
    gl.vertexAttribPointer(
      attrOpt.index,
      attrOpt.size,
      gl[attrOpt.type],
      attrOpt.normalized,
      attrOpt.stride,
      attrOpt.offset
    );
    // 建立关联
    gl.enableVertexAttribArray(attrOpt.index);
  }

  /**
   * 加载2D纹理对象
   */
  create2DTexture(texOption: texImage2DOption, texParam?: TexParam) {
    const gl = this.gl;
    const { level, internalformat, width, height, type, imageSource } =
      texOption;
    // 创建纹理
    const texTure = gl.createTexture();
    const target = gl.TEXTURE_2D;
    // 绑定纹理
    gl.bindTexture(target, texTure);
    // 指定二维纹理图像
    const format = gl[internalformat];
    if (imageSource["buffer"]) {
      gl.texImage2D(
        target,
        level,
        format,
        width || 1,
        height || 1,
        0,
        format,
        gl[type],
        imageSource as ArrayBufferView
      );
    } else {
      gl.texImage2D(
        target,
        level,
        format,
        format,
        gl[type],
        imageSource as TexImageSource
      );
    }
    // 设置纹理参数
    if (!texParam) {
      return texTure;
    }
    const { mag_filter, min_filter, wrap_s, wrap_t } = texParam;
    !Object.is(mag_filter, undefined) &&
      gl.texParameteri(target, gl.TEXTURE_MAG_FILTER, gl[mag_filter]);
    !Object.is(min_filter, undefined) &&
      gl.texParameteri(target, gl.TEXTURE_MIN_FILTER, gl[min_filter]);
    !Object.is(wrap_s, undefined) &&
      gl.texParameteri(target, gl.TEXTURE_WRAP_S, gl[wrap_s]);
    !Object.is(wrap_t, undefined) &&
      gl.texParameteri(target, gl.TEXTURE_WRAP_T, gl[wrap_t]);
    // gl.generateMipmap(target);
    gl.bindTexture(target, null);
    return texTure;
  }

  /**获取非2的幂纹理参数设置项 */
  getTexParamNotPowerOf2(): TexParam {
    return {
      min_filter: TexParameter_Min_Filter.LINEAR,
      wrap_s: TexParameter_Wrap_ST.CLAMP_TO_EDGE,
      wrap_t: TexParameter_Wrap_ST.CLAMP_TO_EDGE,
    };
  }
}

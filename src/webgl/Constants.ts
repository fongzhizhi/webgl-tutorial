/**
 * 着色器类型
 */
export enum WebGLShaderType {
  /**顶点着色器 */
  VERTEX_SHADER = "VERTEX_SHADER",
  /**片段着色器 */
  FRAGMENT_SHADER = "FRAGMENT_SHADER",
}

/**
 * 缓冲的用途
 */
export enum WebGLBufferUsage {
  /**常用但不常改(~只读) */
  STATIC_DRAW = "STATIC_DRAW",
  /**常用且常改(~读写) */
  DYNAMIC_DRAW = "DYNAMIC_DRAW",
  /**不常用(~临时) */
  STREAM_DRAW = "STREAM_DRAW",
}

/**
 * 缓冲类型
 * @description gl.bindBuffer 使用
 */
export enum WebGLBufferType {
  /**包含顶点属性的Buffer，如顶点坐标，纹理坐标数据或顶点颜色数据 */
  ARRAY_BUFFER = "ARRAY_BUFFER",
  /**用于元素索引的Buffer */
  ELEMENT_ARRAY_BUFFER = "ELEMENT_ARRAY_BUFFER",
}

/**
 * 缓冲参数
 */
export type BufferOption = Partial<{
  /**数据空间大小(设置了data则无需指定) */
  size: number;
  /**数据 */
  data: BufferSource;
  /**用途 */
  usage: WebGLBufferUsage;
}>;

/**每个顶点属性的组成数量 */
export type WebGLVertexSize = 1 | 2 | 3 | 4;

/**
 * 顶点数据类型
 */
export enum WebGLVertexDataType {
  BYTE = "BYTE",
  SHORT = "SHORT",
  UNSIGNED_BYTE = "UNSIGNED_BYTE",
  UNSIGNED_SHORT = "UNSIGNED_SHORT",
  FLOAT = "FLOAT",
}

/**
 * 顶点属性参数
 */
export interface VertexAttrOption {
  /**属性索引 */
  index: number | string;
  /**属性尺寸 */
  size: WebGLVertexSize;
  /**属性数据类型 */
  type: WebGLVertexDataType;
  /**是否归一化 */
  normalized: boolean;
  /**相邻顶点之间的字节数(即数组中一行长度)。范围[0, 255] */
  stride: GLsizei;
  /**顶点属性起始索引字节偏移量 */
  offset: GLintptr;
}

/**
 * 绘制类型
 */
export enum WebGLDrawType {
  /**绘制点阵 */
  POINTS = "POINTS",
  /**绘制连续线条 */
  LINE_STRIP = "LINE_STRIP",
  /**绘制收尾闭合的连续线条 */
  LINE_LOOP = "LINE_STRIP",
  /**绘制系列线段 */
  LINES = "LINES",
  /**绘制三角形带 */
  TRIANGLE_STRIP = "TRIANGLE_STRIP",
  /**绘制三角扇 */
  TRIANGLE_FAN = "TRIANGLE_FAN",
  /**绘制系列三角形 */
  TRIANGLES = "TRIANGLES",
}

/**绘制物体的缓冲数据类型 */
export enum WebGLDrawElementType {
  UNSIGNED_BYTE = "UNSIGNED_BYTE",
  UNSIGNED_SHORT = "UNSIGNED_SHORT",
}

/**
 * WebGL单位坐标系
 * @description 三维迪卡尔坐标系
 * + x: 左负右正
 * + y: 上正下负
 * + z: 前正后负
 */
export enum WebGLCoordinate {
  /**x左 */
  X_L = -1,
  /**x右 */
  X_R = 1,
  /**y上 */
  Y_T = 1,
  /**y下 */
  Y_B = -1,
  /**z前 */
  Z_F = 1,
  /**z后 */
  Z_B = -1,
}

/**
 * 2D纹理图像颜色组件类型
 */
export enum TexImage2DInternalformat {
  RGBA = "RGBA",
  RGB = "RGB",
  LUMINANCE_ALPHA = "LUMINANCE_ALPHA",
  LUMINANCE = "LUMINANCE",
  ALPHA = "ALPHA",
}

/**
 * 2D纹理图像纹素数据的数据类型
 */
export enum TexImage2DTexelType {
  UNSIGNED_BYTE = "UNSIGNED_BYTE",
  UNSIGNED_SHORT_5_6_5 = "UNSIGNED_SHORT_5_6_5",
  UNSIGNED_SHORT_4_4_4_4 = "UNSIGNED_SHORT_4_4_4_4",
  UNSIGNED_SHORT_5_5_5_1 = "UNSIGNED_SHORT_5_5_5_1",
}

/**纹理放大滤波器 */
export enum TexParameter_Mag_Filter {
  /**default */
  LINEAR = "LINEAR",
  NEAREST = "NEAREST",
}

/**纹理缩小滤波器 */
export enum TexParameter_Min_Filter {
  LINEAR = "LINEAR",
  NEAREST = "NEAREST",
  NEAREST_MIPMAP_NEAREST = "NEAREST_MIPMAP_NEAREST",
  LINEAR_MIPMAP_NEAREST = "LINEAR_MIPMAP_NEAREST",
  /**default */
  NEAREST_MIPMAP_LINEAR = "NEAREST_MIPMAP_LINEAR",
  LINEAR_MIPMAP_LINEAR = "LINEAR_MIPMAP_LINEAR",
}

/**纹理坐标水平填充s | 纹理坐标垂直填充t*/
export enum TexParameter_Wrap_ST {
  /**default */
  REPEAT = "REPEAT",
  CLAMP_TO_EDGE = "CLAMP_TO_EDGE",
  MIRRORED_REPEAT = "MIRRORED_REPEAT",
}

export interface texImage2DOption {
  /**详细级别(0是基本图像等级, n级别) */
  level: number;
  /**颜色组件类型 */
  internalformat: TexImage2DInternalformat;
  /**纹理宽度 */
  width?: number;
  /**纹理高度 */
  height?: number;
  /**texel数据的数据类型 */
  type: TexImage2DTexelType;
  /**像素源 */
  imageSource: TexImageSource | ArrayBufferView;
}

/**纹理参数 */
export type TexParam = Partial<{
  /**纹理放大滤波器 */
  mag_filter: TexParameter_Mag_Filter;
  /**纹理缩小滤波器 */
  min_filter: TexParameter_Min_Filter;
  /**纹理坐标水平填充s */
  wrap_s: TexParameter_Wrap_ST;
  /**纹理坐标垂直填充t */
  wrap_t: TexParameter_Wrap_ST;
}>;

/**
 * 渲染程序配置
 */
export interface RenderpProgramConfig {
  /**顶点着色器配置 */
  vertex: RenderpProgramVertex;
  /**片元着色器配置 */
  fragment: RenderpProgramFragment;
}

/**顶点着色器配置 */
export interface RenderpProgramVertex {
  /**源码 */
  code: string;
  /**描述信息 */
  desc: {
    /**每组顶点缓冲数据长度 */
    // arrayStride: number;
    /**属性表 */
    attributes: VertexAttrOption[];
  };
}

/**片元着色器配置 */
export interface RenderpProgramFragment {
  /**源码 */
  code: string;
}

/**uniform数据描述结构 */
export interface UniformData {
  /**定位索引 */
  location: number | string;
  /**缓冲值 */
  data: Iterable<number>;
  desc: {
    /**格式 */
    format: "float" | "int" | "mat";
    /**单个缓冲值尺寸 */
    unitSize: WebGLVertexSize;
    transpose?: boolean;
  };
}

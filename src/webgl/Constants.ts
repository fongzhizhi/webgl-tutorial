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
  /**常用但不常改 */
  STATIC_DRAW = "STATIC_DRAW",
  /**常用且常改 */
  DYNAMIC_DRAW = "DYNAMIC_DRAW",
  /**不常用 */
  STREAM_DRAW = "STREAM_DRAW",
}

/**
 * 缓冲类型
 * @description gl.bindBuffer 使用
 */
export enum WebGLBufferType {
  ARRAY_BUFFER = "ARRAY_BUFFER",
  ELEMENT_ARRAY_BUFFER = "ELEMENT_ARRAY_BUFFER",
}

/**
 * 缓冲参数
 */
export type BufferOption = Partial<{
  /**尺寸 */
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
  /**顶点属性索引 */
  index: number;
  /**顶点属性组成数量 */
  size: WebGLVertexSize;
  /**顶点数据类型 */
  type: WebGLVertexDataType;
  /**是否归一化 */
  normalized: boolean;
  /**以字节为单位指定连续顶点属性开始之间的偏移量(即数组中一行长度)。范围[0, 255] */
  stride: GLsizei;
  /**顶点属性数组中第一部分的字节偏移量 */
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

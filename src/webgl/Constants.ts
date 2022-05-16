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
export interface vertexAttrOption {
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

import { mat4 } from "gl-matrix";

/**
 * 初始化着色器程序，让WebGL知道如何绘制我们的数据
 */
function initShaderProgram(
  gl: WebGLRenderingContext,
  vsSource: string,
  fsSource: string
) {
  // 创建顶点着色器和片段着色器
  const vertextShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
  // 创建着色器程序
  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertextShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);
  // 创建失败
  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert("初始化着色器程序失败：" + gl.getProgramInfoLog(shaderProgram));
    return null;
  }
  return shaderProgram;
}

interface ProgramInfo {
  program: WebGLProgram;
  attribLocations: {
    vertexPosition: number;
  };
  uniformLocations: {
    projectionMatrix: WebGLUniformLocation;
    modelViewMatrix: WebGLUniformLocation;
  };
}

/**
 * 获取着色器程序相关信息
 */
function getProgramInfo(
  gl: WebGLRenderingContext,
  shaderProgram: WebGLProgram
): ProgramInfo {
  return {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, "aVertexPosition"),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(
        shaderProgram,
        "uProjectionMatrix"
      ),
      modelViewMatrix: gl.getUniformLocation(shaderProgram, "uModelViewMatrix"),
    },
  };
}

/**
 * 创建指定类型的着色器，上传source源码并编译
 */
function loadShader(gl: WebGLRenderingContext, type: number, source: string) {
  // 创建指定类型着色器
  const shader = gl.createShader(type);
  // 上传着色器源码
  gl.shaderSource(shader, source);
  // 编译着色器
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert("编译着色器失败");
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

interface BufferInfo {
  position: WebGLBuffer;
}

/**
 * 初始化缓冲器
 */
function initBuffers(gl: WebGLRenderingContext): BufferInfo {
  // 创建并绑定缓冲器
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  // 顶点数据
  const vertices = [1, 1, 0, -1, 1, 0, 1, -1, 0, -1, -1, 0];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  return {
    position: positionBuffer,
  };
}

/**
 * 绘制场景
 */
function drawScene(
  gl: WebGLRenderingContext,
  programInfo: ProgramInfo,
  buffers: BufferInfo
) {
  // 一些canvas的初始化工作
  globalThis.clear(0, 0, 0, 1); // 使用黑色清空画布
  gl.clearDepth(1); // 清空所有图元
  gl.enable(gl.DEPTH_TEST); // 启用深度测试
  gl.depthFunc(gl.LEQUAL); // 指定深度比较函数

  // 在绘制前清空画布
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  const filedOfView = (45 * Math.PI) / 180; // 弧度
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  const zNear = 0.1;
  const zFar = 100;

  const projectMatrix = mat4.create();
  mat4.perspective(projectMatrix, filedOfView, aspect, zNear, zFar); // 生成具有给定边界的透视投影矩阵

  const modelViewMatrix = mat4.create();
  mat4.translate(modelViewMatrix, modelViewMatrix, [-0, 0, -6]);

  const numComponents = 3;
  const type = gl.FLOAT;
  const normalize = false;
  const stide = 0;
  const offset = 0;
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
}

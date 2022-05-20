import { mat4 } from "gl-matrix";
import { $$ } from "../utils/xml";
import { WebGLBufferUsage, WebGLVertexDataType } from "../webgl/Constants";
import { WebGLRender } from "../webgl/WebGLRender";
import { initCanvas, loadUniform } from "./2.drawingASquare";
import { requestAnimationFrameDraw } from "./4.drawingAAnimatingSquare";
import { draw } from "./5.drawingACube";
import { loadUniform_uSampler, loadVertexBuffer } from "./6.usingTextureOnCube";

/**
 * 使用灯光
 */
export function usingLighting() {
  requestAnimationFrameDraw(drawingACube);
}

/**
 * 绘制一个具有灯光效果的正方体
 */
export function drawingACube(
  radian: number,
  imageSource?: TexImageSource | ArrayBufferView
) {
  // 构建渲染器
  const render = new WebGLRender($$("#glcanvas") as HTMLCanvasElement);
  const gl = render.gl;
  // 画布初始化
  initCanvas(gl);
  // 创建着色器程序
  const program = createProgram(render);
  // 更新缓冲数据
  const cubeTexTure = loadVertexBuffer(render, program, imageSource);
  loadVertexBuffer_aVertexNormal(render, program);
  // 更新uniform属性值
  const uniformInfo = loadUniform(render, program, {
    y: radian * 0.8,
    z: radian,
  });
  loadUniform_uNormalMatrix(render, program, uniformInfo.modelViewMatrix);
  loadUniform_uSampler(render, program, cubeTexTure);
  // 绘制
  draw(gl);
}

/**
 * 创建着色器程序
 */
export function createProgram(render: WebGLRender) {
  const vs = `
    attribute vec4 aVertexPosition;
    attribute vec4 aTextureCoord;
    attribute vec3 aVertexNormal;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;
    uniform mat4 uNormalMatrix;

    varying lowp vec4 vTextureCoord;
    varying highp vec3 vLighting;

    void main() {
        gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
        vTextureCoord = aTextureCoord;
        // 加入光照效果
        highp vec3 ambientLight = vec3(0.2, 0.2, 0.2); // 环境光位置
        highp vec3 directionalLightColor = vec3(1, 1, 1); // 方向光颜色
        highp vec3 directionalVector = normalize(vec3(1,0,1)); // 方向关位置
        
        highp vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);
        highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);

        vLighting = ambientLight + (directionalLightColor * directional);
    }
  `;
  const fs = `
    varying lowp vec4 vTextureCoord;
    varying highp vec3 vLighting;

    uniform sampler2D uSampler;
    
    void main() {
      // 纹素
      highp vec4 texelColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));
      // 片段颜色
      gl_FragColor = vec4(texelColor.rgb * vLighting, texelColor.a);
    }
  `;
  return render.createProgramBySource(vs, fs);
}

/**更新属性顶点法向量 aVertexNormal 的缓冲数据 */
function loadVertexBuffer_aVertexNormal(
  render: WebGLRender,
  program: WebGLProgram
) {
  const front = [0, 0, 1];
  const back = [0, 0, -1];
  const top = [0, 1, 0];
  const bottom = [0, -1, 0];
  const right = [1, 0, 0];
  const left = [-1, 0, 0];
  // 顶点法向量
  const vertextNormals: number[] = [];
  [front, back, top, bottom, right, left].forEach((face) => {
    for (let i = 0; i < 4; i++) {
      vertextNormals.push(...face);
    }
  });
  render.createArrayBuffer(
    {
      data: new Float32Array(vertextNormals),
      usage: WebGLBufferUsage.STATIC_DRAW,
    },
    {
      index: render.getAttribLocation(program, "aVertexNormal"),
      size: 3,
      type: WebGLVertexDataType.FLOAT,
      normalized: false,
      stride: 0,
      offset: 0,
    }
  );
}

/**更新 uNormalMatrix 的值 */
function loadUniform_uNormalMatrix(
  render: WebGLRender,
  program: WebGLProgram,
  modelViewMatrix: mat4
) {
  const gl = render.gl;
  const normalMatrix = mat4.create();
  mat4.invert(normalMatrix, modelViewMatrix);
  mat4.transpose(normalMatrix, normalMatrix);
  gl.uniformMatrix4fv(
    render.getUniformLocation(program, "uNormalMatrix"),
    false,
    normalMatrix
  );
}

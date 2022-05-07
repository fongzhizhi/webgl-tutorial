# webgl-tutorial

[WebGL](https://www.khronos.org/webgl/) 使得网页在支持 HTML [canvas](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/canvas) 标签的浏览器中，不需要使用任何插件，便可以使用基于 [OpenGL ES](https://www.khronos.org/opengles/) 2.0 的 API 在 canvas 中进行 3D 渲染。

本教程将按照以下内容逐一展开：

- [WebGL 基础](#webgl-基础)
- [WebGL 进阶](#webgl-进阶)
- [WebGL 示例](#webgl-示例)

## WebGL 基础

### 获取 WebGL 上下文环境

[canvas](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/canvas) 是浏览器绘制图形的画布，在绘制之前我们首先都需要通过[getContext](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLCanvasElement/getContext)函数获取**渲染上下文**，不同的上下文为画布绘图提供了不同的 API，目前支持的渲染上下文有：

- **2d**：建立一个 [`CanvasRenderingContext2D`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D) 二维渲染上下文。
- **webgl**：或 experimental-webgl，将创建一个 [`WebGLRenderingContext`](https://developer.mozilla.org/zh-CN/docs/Web/API/WebGLRenderingContext) 三维渲染上下文对象。只在实现[WebGL](https://developer.mozilla.org/en-US/docs/Web/WebGL) 版本 1(OpenGL ES 2.0)的浏览器上可用。
- **webgl2**：或 experimental-webgl2，这将创建一个 [`WebGL2RenderingContext`](https://developer.mozilla.org/zh-CN/docs/Web/API/WebGL2RenderingContext) 三维渲染上下文对象。只在实现 [WebGL](https://developer.mozilla.org/en-US/docs/Web/WebGL) 版本 2 (OpenGL ES 3.0)的浏览器上可用。（实验）
- **bitmaprenderer**：将创建一个只提供将 canvas 内容替换为指定[`ImageBitmap`](https://developer.mozilla.org/zh-CN/docs/Web/API/ImageBitmap)功能的[`ImageBitmapRenderingContext`](https://developer.mozilla.org/zh-CN/docs/Web/API/ImageBitmapRenderingContext) 。

如果返回 null，则说明执行脚本的浏览器环境不支持该类型的渲染上下文。

下面是获取上下文的简单<span class="example" key="1">示例</span>：

```ts
/**
 * 获取webgl渲染上下文
 */
export function getWebGLContext() {
  const canvas = $$("#glcanvas") as HTMLCanvasElement;
  /**WebGl上下文 */
  const gl = canvas && canvas.getContext("webgl");
  if (!gl) {
    alert("无法初始化WebGL，你的浏览器、操作系统或硬件等可能不支持WebGL。");
    return;
  }
  // 使用完全不透明的黑色清除所有图像
  gl.clearColor(0, 0, 0, 1);
  // 用上面指定的颜色清除缓冲区
  gl.clear(gl.COLOR_BUFFER_BIT);
}
```

### 绘制 2D 内容

当我们获取了渲染上下文后，就能使用上下文的 API 来绘图了，最简单的就是绘制一些简单的 2D 内容，如线条，矩形等等。

#### 渲染场景

#### 渲染对象

#### 矩阵通用计算

### 使用着色器(shader)赋予颜色

### 让对象动起来

### 创建 3D 物体

### 使用纹理贴图

### 使用灯光

### 动画纹理贴图

## WebGL 进阶

### WebGL 模型视图投影

### Web 中的矩阵运算

## WebGL 示例

待补充...

## 资源

- [Raw WebGL: WebGL 入门](https://www.youtube.com/embed/H4c8t6myAWU/?feature=player_detailpage) Nick Desaulniers 主讲的 WebGL 基础知识。如果你从未接触过底层的图形编程，这是一个开始学习初级图形编程的好地方。
- [WebGL 官网](https://www.khronos.org/webgl/) Khronos Group 的 WebGL 官方站点。
- [学习 WebGL](http://learningwebgl.com/blog/?page_id=1217) 一个关于如何使用 WebGL 的教程站点。
- [WebGL 基础](https://www.html5rocks.com/en/tutorials/webgl/webgl_fundamentals/) 一个关于 WebGL 的基础教程。
- [WebGL 试炼](http://webglplayground.net/) 一个在线创建和分享 WebGL 的工具站点，非常适合快速创建一个原型或者体验一个成品。
- [WebGL Academy](http://www.webglacademy.com/) 通过一个 HTML/JavaScript 编辑器来学习一个基础的 WebGl 基础知识。
- [WebGL Stats](http://webglstats.com/) 一个统计 WebGL 在不同平台上能力表现的网站。

## 库

- [glMatrix](https://github.com/toji/gl-matrix) 创建高性能 WebGL 应用的 JavaScript 矩阵矢量库。
- [PhiloGL](https://developer.mozilla.org/zh-CN/docs/Web) 一个用于数据可视化、创意编程和游戏开发的 WebGL 库。
- [Pixi.js](https://www.pixijs.com/)是一种快速的开源 2D WebGL 渲染器。
- [PlayCanvas](https://playcanvas.com/)是一个开源游戏引擎。
- [Sylvester](http://sylvester.jcoglan.com/)是一个用于处理向量和矩阵的开源库。尚未针对 WebGL 进行优化，但功能极其强大。
- [three.js](https://threejs.org/)是一个开源的，功能齐全的 3D WebGL 库。
- [Phaser](https://phaser.io/)是一个适用于 Canvas 和 WebGL 的浏览器游戏的快速，免费和有趣的开源框架。
- [RedGL](https://github.com/redcamel/RedGL2) 是一个开源 3D WebGL 库。
- [vtk.js](https://kitware.github.io/vtk-js/) 是一个 JavaScript 库，用于在浏览器中进行科学可视化。

## 参考

> [WebGL -MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/WebGL_API)
>
> [WebGL 教程](https://developer.mozilla.org/zh-CN/docs/Web/API/WebGL_API/Tutorial)

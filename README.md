# webgl-tutorial

> [WebGL -MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/WebGL_API)
>
> [WebGL 教程](https://developer.mozilla.org/zh-CN/docs/Web/API/WebGL_API/Tutorial)

[WebGL](https://www.khronos.org/webgl/) 使得网页在支持 HTML [canvas](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/canvas) 标签的浏览器中，不需要使用任何插件，便可以使用基于 [OpenGL ES](https://www.khronos.org/opengles/) 2.0 的 API 在 canvas 中进行 3D 渲染。

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
  const glContext = canvas && canvas.getContext("webgl");
  if (!glContext) {
    alert("无法初始化WebGL，你的浏览器、操作系统或硬件等可能不支持WebGL。");
    return;
  }
  // 使用完全不透明的黑色清除所有图像
  glContext.clearColor(0, 0, 0, 1);
  // 用上面指定的颜色清除缓冲区
  glContext.clear(glContext.COLOR_BUFFER_BIT);
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

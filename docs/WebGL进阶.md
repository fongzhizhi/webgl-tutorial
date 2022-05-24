# WebGL 进阶

## WebGL 模型、视图和投影

> 本节将详细讲述显示 3D 物体视图的三种核心矩阵：模型、视图和投影矩阵。

WebGL 空间中的点和多边形的个体转化由基本的转换矩阵（例如平移，缩放和旋转）处理。可以将这些矩阵组合在一起并以特殊方式分组，以使其用于渲染复杂的 3D 场景。这些组合成的矩阵最终将原始数据类型移动到一个称为裁剪空间的特殊坐标空间中。这是一个中心点位于(0, 0, 0)，角落范围在 (-1, -1, -1) 到 (1, 1, 1) 之间，2 个单位宽的立方体。该剪裁空间被压缩到一个二维空间并栅格化为图像。

下面讨论的第一个矩阵是**模型矩阵**，它定义了如何获取原始模型数据并将其在 3D 世界空间中移动。**投影矩阵**用于将世界空间坐标转换为剪裁空间坐标。常用的投影矩阵（**透视矩阵**）用于模拟充当 3D 虚拟世界中观看者的替身的典型相机的效果。**视图矩阵**负责移动场景中的对象以模拟相机位置的变化，改变观察者当前能够看到的内容。

### 矩阵基础：平移、缩放和旋转

待补充...

### 裁剪空间

**裁剪空间（Clip Space）**，顾名思义，就是指位于这块空间内的图元将会保留，而超出这部分空间的图元将会把剔除，而与空间边界相交的图元就会被裁剪掉。

在顶点着色器程序中，`gl_Position`等的坐标就是使用的裁剪空间，它是一个角在(-1, -1, -1)，对角在 (1, 1, 1)，中心点在 (0, 0, 0) 的每边 2 个单位的立方体，如下图所示：

<img src="../src/assets/clip-space-graph.svg" width="700" alt="A 3d graph showing clip space in WebGL." />

剪空间使用的这个两个立方米坐标系又称为**归一化设备坐标**（NDC），在研究和使用 WebGL 代码时，你可能时不时的会使用这个术语。

我们都知道，现实世界中的物体有大有小，位置也都各不相同，为了在一个通用的空间中能够展示所有场景，这样一个归一化的坐标无疑统一了坐标规范，使得所有场景能够被展现出来。

有了裁剪空间的概念，我们就有了**空间坐标系的一些列转换矩阵**：

为了方便地计算和表示现实世界的场景，一般我们都需要建模，而最终我们通过模型的组合，构建为现实世界的场景，即`模型坐标 -> 世界坐标`，这一转换过程我们通过**模型矩阵**来实现。

而世界坐标系需要**展示出来**，需要有一个观察者，好比一个立方体，从不同的方向、角度和距离观察，其视图都是不一样的，因此`世界坐标 -> 视图坐标`需要经过**视图矩阵**来转换。

视图坐标才是我们真正需要展示的画面，而这个画面又必须在裁剪空间中展示，所以还需要利用**投影矩阵**实现`视图坐标 -> 裁剪空间坐标`的转换。

以上，就是矩阵，在空间坐标系中的运用：实现不同空间坐标系的转换。

所以，一般 WebGL 中的空间需要经过以下转换：

**模型空间** ---[模型矩阵]--> **世界空间** ---[视图矩阵]--> **视图空间** ---[投影矩阵]--> **裁剪空间**。

### 裁剪空间案例

#### 矩形框绘制器`BBoxDrawer`

为了更直观地感受裁剪空间的“裁剪”效果，我们故意绘制一些超出裁剪空间范围的矩阵来测试效果。

首先我们封装一个专门用于绘制矩形的类`BBoxDrawer`，类似这样：

```ts
/**矩形框信息 */
export interface BBoxInfo {
  /**上 */
  top: number;
  /**下 */
  bottom: number;
  /**左 */
  left: number;
  /**右 */
  right: number;
  /**深度(z) */
  depth: number;
  /**rgb色值 */
  color: [number, number, number, number];
}

/**
 * 矩形框绘制器
 */
export class BBoxDrawer {
  /**渲染器 */
  private readonly render: WebGLRender;

  /**
   * WebGL渲染器
   * @param canvas canvas元素
   * @param gl_attributes webgl上下文属性
   */
  constructor(
    canvas: HTMLCanvasElement,
    gl_attributes?: WebGLContextAttributes
  ) {
    this.render = new WebGLRender(canvas, gl_attributes);
  }

  /**
   * 绘制
   */
  draw(bboxInfo: BBoxInfo) {
    // 1.创建着色器程序
    // 2.绑定缓冲数据
    // 3.更新uniform属性
    // 4.渲染到画布
  }
}
```

当我们每调用一次`draw`并设置相应的矩形框参数，就会在对应的画布上渲染出一个矩形。

> 注意，为了简化分析过程，我们直接使用裁剪空间坐标作为传入参数，这样，就不需要进行额外的空间坐标系转换。

#### 创建着色器程序

首先明确需求，我们需要绘制矩形，所以顶点着色器只需要接收坐标参数，为了显示时更容易区分，需要片段着色器接收颜色参数。即：

**顶点着色器：**

```glsl
attribute vec3 a_position;

void main() {
    gl_Position = vec4(a_position, 1);
}
```

> 注：这里`gl_Position`使用的是`vec4`类型，即四维向量，为何直接使用三维向量，我们将会在下一小节 [齐次坐标](#齐次坐标) 展开说明。

**片段着色器**：

```glsl
precision mediump float; // 指定float精度
uniform vec4 u_color;

void main() {
    gl_FragColor = u_color;
}
```

#### 绑定缓冲数据

首先确认绘制类型，我们需要绘制矩形，所以一般使用三角形带(`TRIANGLE_STRIP`)的绘制方式，可以使用四个点，也可以使用 6 个点。

现在，我们使用接口`BBoxInfo`来描述矩形框需要的坐标及颜色信息：

```js
/**rgb色值 */
type RGBColor = [number, number, number, number];

/**矩形框信息 */
export interface BBoxInfo {
  /**上 */
  top: number;
  /**下 */
  bottom: number;
  /**左 */
  left: number;
  /**右 */
  right: number;
  /**深度(z) */
  depth: number;
  /**rgb色值 */
  color: RGBColor;
}
```

这样，顶点缓冲就可以写作：

```ts
const { left, bottom, right, top, depth, color } = bboxInfo;
const points = [].concat(
  [left, bottom, depth],
  [right, bottom, depth],
  [left, top, depth],
  [right, top, depth]
);
this.loadBuffer(program, points);
```

#### 更新 uniform 属性

使用到的统一变量只有片段颜色`u_color`：

```ts
gl.useProgram(program);
gl.uniform4fv(render.getUniformLocation(program, "u_color"), bboxInfo.color);
```

> 注：在更新`uniform`之前，别忘了先使用`useProgram`将着色器程序添加到渲染状态。

#### 执行绘制

数据准备完毕，就可以执行绘制了：

```ts
gl.drawArrays(gl[WebGLDrawType.TRIANGLE_STRIP], 0, 4);
```

<span class="example" key="advance_1">示例 1：在裁剪空间绘制矩形</span>

```ts
/**
 * 绘制矩形框
 * @description 验证裁剪空间的裁剪效果
 */
export function drawBBoxs() {
  const canvas = $$("#glcanvas") as HTMLCanvasElement;
  const drawer = new BBoxDrawer(canvas);
  initCanvas(drawer.render.gl);
  drawer.draw({
    top: 0.5,
    bottom: -0.5,
    left: -0.5,
    right: 0.5,
    depth: 0,
    color: [1, 0.4, 0.4, 1], // red
  });
  drawer.draw({
    top: 0.9,
    bottom: 0,
    left: -0.9,
    right: 0.9,
    depth: 0.5,
    color: [0.4, 1, 0.4, 1], // green
  });
  drawer.draw({
    top: 0.3,
    bottom: -1.7,
    left: -0.2,
    right: 1.7,
    depth: 0.8,
    color: [0.4, 0.4, 1, 1], // blue
  });
}
```

我们故意设置第三个矩形的坐标超出裁剪空间`[-1， 1]`的坐标范围，绘制时就会发生裁剪效果了。

### 齐次坐标

### 模型转换

### 除以 w

### 简单投影

### 透视矩阵

### 视图矩阵

## WebGL 矩阵运算

> 本节将对 3D 变换矩阵的工作原理进行深度分析。

## 扩展阅读

- [WebGL 模型视图投影 - MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/WebGL_API/WebGL_model_view_projection)
- [Web 中的矩阵运算 - MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/WebGL_API/Matrix_math_for_the_web)

## 待阅读整理

- [ ] [为何`gl_Position`是一个四维向量，而不是三维向量](https://cloud.tencent.com/developer/ask/sof/131944)

- [ ] [Homogeneous Coordinates（齐次坐标）](https://www.jianshu.com/p/00da27687387)

  想象一下，照相就是把现实世界的三维转换为二维视图，绘制 3D 就是用二维视图表示 3 维坐标而已，齐次坐标的提出，让维度坐标转换成为可能。

- [ ]

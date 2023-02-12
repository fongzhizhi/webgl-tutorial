# WebGL 案例

## 绘制圆

我们知道，`webgl`绘制模式只有以下几种类型：

- `gl.POINTS`：绘制一系列点。
- `gl.LINE_STRIP`：绘制一个线段。即顶点逐一相连。
- `gl.LINE_LOOP`：绘制一个线圈。即顶点逐一相连并收尾闭合。
- `gl.LINES`：绘制一系列独立线段。即每两个顶点绘制一条线段。
- `gl.TRIANGLE_STRIP`：绘制一个[三角带](https://en.wikipedia.org/wiki/Triangle_strip)。每三点绘制一个三角形，且后一个三角形与前一个三角形共享同一条边（即每新增一个顶点，就能绘制一个新三角形）。
- `gl.TRIANGLE_FAN`：绘制一个[三角扇](https://en.wikipedia.org/wiki/Triangle_fan)。同样是每三个点绘制一个三角形，与三角带不同的是，绘制的三角形共享起始顶点，以此形成三角扇。
- `gl.TRIANGLE`：绘制一系列三角形。每三个顶点绘制一个三角形。

可以发现，`webgl`的绘制方式无非三种：点、线段和三角形。如果要绘制一个圆，就要用线段或三角形来模拟。我们发现，三角形扇就很容易模拟圆，因为三角扇共享同一个顶点，这个顶点就是圆心。

实际上，任何复杂图形都可以用无数三角形绘制出来，无非是数量多少的问题，不过这种方法多少有点暴力，而暴力算法往往效率都不高。

### 绘制实心圆

#### 通过三角形来模拟圆

我们可以使用三角形扇来模拟，起始顶点为圆心，后续顶点为圆上的点，点距离越近，绘制出来的圆越逼真。

<span class="example" key="sample_1">通过三角形模拟绘制实心圆</span>。获取顶点的代码如下所示：

```ts
/**获取顶点数据 */
function getVertexs() {
  const center = [0, 0]; // 圆心
  const radius = 1; // 半径
  const whole = 2 * Math.PI;
  const step = whole / 50;
  // [positin * 3, color * 3]
  const vertexData: number[] = [];
  pushPoint(vertexData, center[0], center[1]);
  for (let a = 0; a < whole + step; a += step) {
    const x = center[0] + radius * Math.cos(a);
    const y = center[1] + radius * Math.sin(a);
    pushPoint(vertexData, x, y);
  }
  return vertexData;

  function pushPoint(vertexData: number[], x: number, y: number) {
    const r = Math.abs(x);
    const g = Math.abs(y);
    const b = Math.abs(x + y);
    vertexData.push(x, y, 1, r, g, b);
  }
}
```

暴力的做法简单直接，但是效率往往低下，如果绘制的圆很小，并不值得切割得很细，圆很大切割点又不能太少，点数太多势必造成效率问题。

实际上，除了切割的方法，我们还可以**控制片元着色器**来帮助我们实现切割效果。我们知道，图形在屏幕上显示的过程需要经过：

**顶点坐标 -> 图元装配 -> 光栅化 -> 执行片元着色器**。

通过三角形来模拟圆的方法就是控制图元装配方式的过程，而光栅化之后，图形其实也是被切割成了**单元像素片**，然后通过片元着色器上色，最后图像就显示到了屏幕上，关键就在这里：**光栅化的过程就是一个切割的过程**，而且是切割到最小单位，也就是我们自己组装的三角形实际上也是被再次切割的，那么，就可以在片元着色器中加以判断，过滤掉那些不需要的片元，只保留需要的进行着色，也就实现了同样的效果，而且不需要绘制大量三角形，运行效率自然提升很多。

#### 通过过滤片元着色器来绘制圆

在片元着色器中，可以通过内置变量`gl_PointCoord`来获取当前片元所属点内的坐标，区间为 0.0 到 1.0，此时绘制的点半径为 1，顶点（圆心）坐标为（0.5，0.5）。通过计算当前片元坐标与圆心的距离，过滤掉超过半径的坐标，即超出圆的坐标，绘制出的图案就是一个圆了。

首先，片元着色器：

```glsl
precision mediump float;

void main() {
    float dist = distance(gl_PointCoord, vec2(0.5, 0.5));
    if(dist > 0.5) {
        discard;
    }
    gl_FragColor = vec4(abs(gl_PointCoord.x), abs(gl_PointCoord.y), abs(gl_PointCoord.x + gl_PointCoord.y), 1);
}
```

根据片元着色器，我们需要传入圆心坐标和圆半径，那么顶点着色器可以这样编写：

```glsl
precision mediump float;

attribute vec4 a_Position;  // 顶点
attribute float a_Radius;   // 圆半径

uniform mat4 u_MvpMatrix;  // 模型视图投影矩阵

void main() {
    gl_Position = u_MvpMatrix * a_Position;
    gl_PointSize = a_Radius * 2.0;
}
```

<span class="example" key="sample_2">通过过滤片元着色器来绘制圆</span>。

此外，我们还可以传递实际的半径和顶点坐标来过滤：

<span class="example" key="sample_3">通过过滤片元着色器来绘制圆 2</span>。

## 绘制线宽线段

<span class="example" key="sample_4">绘制线宽线段</span>。

## 绘制线宽圆弧

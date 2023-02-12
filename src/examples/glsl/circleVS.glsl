precision mediump float;

attribute vec4 a_Position;  // 顶点
attribute float a_Radius;   // 圆半径

uniform mat4 u_MvpMatrix;  // 模型视图投影矩阵

void main() {
    gl_Position = u_MvpMatrix * a_Position;
    gl_PointSize = a_Radius * 2.0;
}
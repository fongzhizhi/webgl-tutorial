attribute vec4 a_Position;  // 顶点
attribute vec4 a_Color;     // 顶点颜色

uniform mat4 u_MvpMatrix;   // 模型视图投影矩阵

varying lowp vec4 v_Color;  // 顶点颜色

void main() {
    gl_Position = u_MvpMatrix * a_Position;
    if(bool(a_Color)) {
        v_Color = a_Color;
    }
}

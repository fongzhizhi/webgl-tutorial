precision mediump float;

attribute float a_Index;    // 当前顶点位于三角形三顶点中的序号(0-2)
attribute vec4 a_Center;    // 圆心
attribute float a_Radius;   // 圆半径

uniform mat4 u_MvpMatrix;   // 模型视图投影矩阵

varying vec4 v_Position;    // 当前片元坐标(相对于顶点着色器)
varying vec4 v_Center;      // 圆中心
varying float v_Radius;     // 圆半径

void main() {
    vec4 position = a_Center; // 顶点坐标
    float sq = sqrt(3.0);
    if(a_Index == 0.0) {
        position.x -= sq * a_Radius;
        position.y -= a_Radius;
    } else if(a_Index == 1.0) {
        position.x += sq * a_Radius;
        position.y -= a_Radius;
    } else {
        position.y += 2.0 * a_Radius;
    }
    gl_Position = u_MvpMatrix * position;

    v_Position = position;
    v_Center = a_Center;
    v_Radius = a_Radius;
}
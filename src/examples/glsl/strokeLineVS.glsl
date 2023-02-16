precision mediump float;

attribute vec4 a_start_end; // [startPoint, endPoint]
attribute vec2 a_params;    // [index, stroke]

uniform mat4 u_MvpMatrix;   // 模型视图投影矩阵

varying vec2 v_position;    // 片元坐标
varying vec4 v_start_end;   // [startPoint, endPoint]
varying float v_radius;     // 圆角半径
varying vec4 v_color;       // 颜色

// [线段]顶点着色器
void main(){
    vec2 start = a_start_end.xy;
    vec2 end = a_start_end.zw;
    float index = a_params.x;
    float stroke = a_params.y;
    float radius = stroke / 2.0;

    vec2 direct; // 单位向量
    if(start == end) {
        direct = vec2(1, 0);
    } else {
        direct = normalize(end - start);
    }
    vec2 vertical = vec2(-direct.y, direct.x);  // 单位法向量
    vec2 v_offset = vec2(direct * radius);      // 水平方向落点
    vec2 h_offset = vec2(vertical * radius);    // 垂直方向落点

    vec2 position;
    if(index == 0.0) {
        position = start - v_offset - h_offset;
        v_color = vec4(1.0, 0.0, 0.0, 1.0);
    } else if(index == 1.0) {
        position = end + v_offset - h_offset;
        v_color = vec4(0.0, 1.0, 0.0, 1.0);
    } else if(index == 2.0) {
        position = start - v_offset + h_offset ;
        v_color = vec4(0.0, 0.0, 1.0, 1.0);
    } else {
        position = end + v_offset + h_offset ;
        v_color = vec4(1.0, 1.0, 0.0, 1.0);
    }
    gl_Position = u_MvpMatrix * vec4(position.x, position.y, 0, 1);

    v_position = position;
    v_start_end = a_start_end;
    v_radius = radius;
}
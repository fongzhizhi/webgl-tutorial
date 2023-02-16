precision mediump float;

varying vec2 v_position;    // 片元坐标
varying vec4 v_start_end;   // [startPoint, endPoint]
varying float v_radius;     // 圆角半径
varying vec4 v_color;       // 颜色

void main() {
    // 只需要过滤线段内接矩形外的超出半圆的点
    vec2 start = v_start_end.xy;
    vec2 end = v_start_end.zw;

    vec2 direct; // 单位向量
    if(start == end) {
        direct = vec2(1, 0);
    } else {
        direct = normalize(end - start);
    }
    vec2 dir = v_position - start;
    float l = dot(dir, direct); // 与单位向量的点积
    if(l < 0.0) {
        // 左侧矩形外侧
        float dis = length(dir);
        if(dis > v_radius) {
            discard;
        }
    } else if(l > distance(end, start)) {
        // 右侧矩形外侧
        float dis = length(v_position - end);
        if(dis > v_radius) {
            discard;
        }
    }

    // gl_FragColor = vec4(abs(v_position.x), abs(v_position.y), abs(v_position.x + v_position.y) / 2.0, 1);
    gl_FragColor = v_color;
}
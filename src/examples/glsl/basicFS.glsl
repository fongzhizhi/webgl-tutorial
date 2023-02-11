varying lowp vec4 v_Color;       // 顶点颜色

void main() {
    gl_FragColor = bool(v_Color) ? v_Color : vec4(1, 0, 0, 1);
}
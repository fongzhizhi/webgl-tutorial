precision mediump float;

varying vec4 v_Position;    // 当前片元坐标(相对于顶点着色器)
varying vec4 v_Center;      // 圆中心
varying float v_Radius;     // 圆半径

void main() {
    float dist = distance(v_Position.xy, v_Center.xy);
    if(dist > v_Radius) {
        discard;
    }
    gl_FragColor = vec4(abs(v_Position.x), abs(v_Position.y), abs(v_Position.x + v_Position.y), 1);
}
precision mediump float;

attribute vec4 a_Position;      // 顶点
attribute vec4 a_Color;         // 顶点颜色
attribute vec4 a_Normal;        // 顶点法向量

uniform mat4 u_MvpMatrix;       // 模型视图投影矩阵
uniform vec3 u_LightColor;      // 平行光颜色
uniform vec3 u_LightDirection;  // 平行光方向(归一化)
uniform vec3 u_AmbientLight;    // 环境光颜色

varying lowp vec4 v_Color;      // 顶点颜色

void main() {
    gl_Position = u_MvpMatrix * a_Position;

    vec3 normal = normalize(vec3(a_Normal)); // 归一化法向量
    float nDotL = max(dot(u_LightDirection, normal), 0.0); // 环境光与法向量点积
    vec3 color_diffuse = u_LightColor * a_Color.rgb * nDotL; // 平面漫反射光颜色
    vec3 color_ambient = u_AmbientLight * a_Color.rgb;      // 环境漫反射光颜色
    vec4 color = vec4(color_diffuse + color_ambient, a_Color.a);

    v_Color = color;
}

precision mediump float;

void main() {
    float dist = distance(gl_PointCoord, vec2(0.5, 0.5));
    if(dist > 0.5) {
        discard;
    }
    gl_FragColor = vec4(abs(gl_PointCoord.x), abs(gl_PointCoord.y), abs(gl_PointCoord.x + gl_PointCoord.y), 1);
}
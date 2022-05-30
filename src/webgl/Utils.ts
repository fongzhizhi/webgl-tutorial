import { vec3, vec4 } from "gl-matrix";

/**
 * 3维坐标转齐次坐标
 * @param v 三维向量
 */
export function cartesianToHomogeneous(v: vec3, w = 1): vec4 {
  return [v[0], v[1], v[2], w];
}

/**
 * 齐次坐标转三维坐标
 * @param v 四维向量
 */
export function homogeneousToCartesian(v: vec4): vec3 {
  const w = v[3];
  return [v[0] / w, v[1] / w, v[2] / w];
}

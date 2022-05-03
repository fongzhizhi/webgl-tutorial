/**
 * 查询与选择器匹配的第一个元素
 */
export function $$(selector: string, scope?: Element) {
  return (scope || document).querySelector(selector);
}

/**
 * 查询与选择器匹配的所有元素
 */
export function $$$(selector: string, scope?: Element) {
  return (scope || document).querySelectorAll(selector);
}

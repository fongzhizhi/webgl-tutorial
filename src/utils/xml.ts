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

/**目录表 */
export interface TocMap {
  /**目录标题 */
  text: string;
  /**当前目录级别(h1 ~ h6) */
  level: number;
  /**子目录 */
  children?: TocMap[];
}
/**
 * 获取目录表
 * @param minLevel 最小搜寻标题级别(1~6)
 * @param maxLevel 最大搜寻标题级别(1~6)
 * @param scope 查询范围
 */
export function getHeadings(
  scope?: Element,
  minLevel = 1,
  maxLevel = 6
): TocMap[] | null {
  if (maxLevel < minLevel) {
    return null;
  }
  const selectors: string[] = [];
  for (let level = minLevel; level <= maxLevel; level++) {
    selectors.push("h" + level);
  }
  const headings = $$$(selectors.join(", "), scope);
  if (headings.length == 0) {
    return null;
  }
  const tocMaps: TocMap[] = [];
  const superTocHeap: TocMap[] = [];
  headings.forEach((h) => {
    const level = +h.tagName[1];
    const toc: TocMap = {
      text: (h.innerHTML || "").trim(),
      level,
    };
    if (superTocHeap.length === 0) {
      tocMaps.push(toc);
      superTocHeap.push(toc);
      return;
    }
    // 寻找上一级目录
    let finded = false;
    let superToc: TocMap = null;
    while (superTocHeap.length > 0 && !finded) {
      superToc = superTocHeap[superTocHeap.length - 1];
      if (superToc.level < level) {
        if (!superToc.children) {
          superToc.children = [];
        }
        superToc.children.push(toc);
        finded = true;
      } else {
        superTocHeap.pop();
      }
    }
    if (!finded) {
      tocMaps.push(toc);
    }
    superTocHeap.push(toc);
  });

  return tocMaps;
}

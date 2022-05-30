import { loadDocByUrl } from "../utils/router";
import { debounce } from "../utils/util";
import {
  $$,
  $$$,
  getHeadings,
  getElementViewTop,
  TocMap,
  isScroll2Bottom,
} from "../utils/xml";
import { getExampleCall } from "./exampleMap";
import { DrawAnimationFrame } from "./public";

/**示例返回按钮选择器 */
const keyBackBtnSelector = "#canvas .info .key";

/**
 * 示例按钮事件初始化
 */
export function exampleEventInit() {
  let listHtml = "";
  $$$("[key].example").forEach((el) => {
    el.setAttribute("title", "点击预览效果");
    el.addEventListener("click", clickEvent);
    const key = el.getAttribute("key");
    listHtml += `<li key="${key}">${el.innerHTML}</li>`;
  });

  /**示例列表面板 */
  const listPanel = $$("#example-list");
  if (!listPanel || !listHtml) {
    return;
  }
  $$("#canvas .examples").classList.remove("hidden");
  listPanel.innerHTML = listHtml;
  $$$("li", listPanel).forEach((el) => {
    el.addEventListener("click", clickEvent);
  });

  /**点击事件 */
  function clickEvent(e: Event) {
    const key = (e.target as Element).getAttribute("key");
    const fun = getExampleCall(key);
    if (typeof fun === "function") {
      const keyBackBtn = $$(keyBackBtnSelector);
      keyBackBtn.setAttribute("key", key);
      keyBackBtn.innerHTML = "示例" + key.replace(/.+_/, "");
      $$("#canvas").scrollIntoView({
        behavior: "smooth",
      });
      cancelAnimationFrame(DrawAnimationFrame.index); // 清除之前使用过的动画绘制
      setTimeout(() => {
        fun.call(this);
      }, 200);
    } else {
      alert(
        `未找到示例${key}的回调函数, 请在 src/app/exampleMap.ts 中配置映射表 ExampleMap`
      );
    }
  }
}

/**
 * 示例返回按钮事件初始化
 */
export function exampleBackBtnEventInit() {
  $$(keyBackBtnSelector).addEventListener("click", (e) => {
    const key = (e.target as Element).getAttribute("key");
    const keyEle = key ? $$(`[key="${key}"].example`) : $$("#logo");
    keyEle &&
      keyEle.scrollIntoView({
        behavior: "smooth",
      });
  });
}

/**
 * 目标锚点事件初始化
 * @description 点击 a[path] 类型锚点，打开对应地址进行阅览
 */
export function pathAnchorEventInit() {
  $$$("a[path]").forEach((el) => {
    el.addEventListener("click", clickEvent);
  });

  /**点击事件 */
  async function clickEvent(e: Event) {
    const url = (e.target as Element).getAttribute("path");
    history.pushState("", "", url);
    history.go();
    e.preventDefault();
  }
}

/**
 * 历史记录监听
 */
export function historyEventInit() {
  window.addEventListener("popstate", loadDocByUrl);
}

/**
 * 目录面板初始化
 */
export function tocPanelEventInit() {
  // 获取标题目录
  const tocMap = getHeadings($$("#docs"), 2, 3);
  if (!tocMap) {
    return;
  }
  // 创建目录面板
  let tocHtml = "";
  let minLevel = 6;
  const anchors: string[] = [];
  tocMap.forEach((item) => {
    minLevel = Math.min(minLevel, item.level);
  });
  tocMap.forEach((item) => {
    tocHtml = getTocHtml(item, minLevel, tocHtml, anchors);
  });
  tocHtml = `<div class="toc"><ul>${tocHtml}</ul></div>`;
  // 生成面板
  const tocFragment = document.createRange().createContextualFragment(tocHtml);
  const parent = $$("#app");
  parent.appendChild(tocFragment);
  // 监听文档滚动
  document.addEventListener(
    "scroll",
    debounce((e) => {
      const activeCls = "active";
      let lastView = -1;
      let i = 0;
      const isBot = isScroll2Bottom();
      if (!isBot) {
        for (const a of anchors) {
          const viewTop = getElementViewTop($$("#" + a) as HTMLElement);
          if (viewTop <= 1) {
            // 已经滚过视野
            lastView = i;
          } else {
            break;
          }
          i++;
        }
      } else {
        lastView = anchors.length - 1;
      }
      $$(`.toc li.${activeCls}`)?.classList.remove(activeCls);
      if (lastView >= -1) {
        const liEle = $$(`.toc li[target="${anchors[lastView]}"]`, parent);
        if (!liEle) {
          return;
        }
        liEle.classList.add(activeCls);
        liEle.scrollIntoView({
          behavior: "smooth",
          inline: "start",
        });
        $$(".toc").scrollLeft = 0;
      }
    })
  );
  // 位置自适应
  window.addEventListener(
    "resize",
    debounce((e) => autoTocPanelPistion())
  );
  autoTocPanelPistion();

  /**获取目录html */
  function getTocHtml(
    toc: TocMap,
    minLevel: number,
    tocHtml: string,
    anchors: string[]
  ) {
    const anchor = getAnchorStr(toc.text);
    anchors.push(anchor);
    /**缩进 */
    const tuckunderHtml = '<span class="tuckunder"></span>';
    const titleSpan = `<span class="title" title="${toc.text}"><a href="#${anchor}">${toc.text}</a></span>`;
    let tuckunders = "";
    const tuckunderIndex = toc.level - minLevel;
    for (let i = 0; i < tuckunderIndex; i++) {
      tuckunders += tuckunderHtml;
    }
    tocHtml += `<li target="${anchor}"><div class="title-node">${tuckunders}${titleSpan}</div></li>`;
    toc.children &&
      toc.children.forEach((item) => {
        tocHtml = getTocHtml(item, minLevel, tocHtml, anchors);
      });
    return tocHtml;
  }

  /**获取锚点字符串 */
  function getAnchorStr(title: string) {
    const spaceCode = "-";
    return title.replace(/\s/g, spaceCode).toLowerCase();
  }

  /**自动调整面板的位置：居中显示 */
  function autoTocPanelPistion() {
    const tocPanel = $$(".toc") as HTMLElement;
    const clientHeight = tocPanel.clientHeight;
    const top = (document.documentElement.clientHeight - clientHeight) / 2;
    tocPanel.style && (tocPanel.style.top = top + "px");
  }
}

export function canvasInit() {
  window.addEventListener(
    "resize",
    debounce((e) => autoCanvasSize())
  );
  autoCanvasSize();

  function autoCanvasSize() {
    const spacing = 25;
    const examplesPanelWidth = 300;
    const canvasWidth =
      $$("#canvas")?.clientWidth - examplesPanelWidth - spacing;
    const glcanvas = $$("#glcanvas") as HTMLCanvasElement;
    if (canvasWidth && glcanvas) {
      glcanvas.width = canvasWidth;
      const height = canvasWidth * 0.75;
      glcanvas.height = height;
    }
  }
}

/**
 * 事件初始化
 * @description 画布刷新时需要调用
 */
export function eventInit() {
  exampleEventInit();
  exampleBackBtnEventInit();
  pathAnchorEventInit();
  tocPanelEventInit();
  canvasInit();
}

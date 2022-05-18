import { loadDocs } from "../utils/router";
import { $$, $$$ } from "../utils/xml";
import { getExampleCall } from "./exampleMap";

/**实例返回按钮选择器 */
const keyBackBtnSelector = "#canvas .info .key";

/**
 * 实例按钮事件初始化
 */
export function exampleEventInit() {
  $$$("[key].example").forEach((el) => {
    el.setAttribute("title", "点击预览效果");
    el.addEventListener("click", clickEvent);
  });

  /**点击事件 */
  function clickEvent(e: Event) {
    const key = (e.target as Element).getAttribute("key");
    const fun = getExampleCall(key);
    if (typeof fun === "function") {
      const keyBackBtn = $$(keyBackBtnSelector);
      keyBackBtn.setAttribute("key", key);
      keyBackBtn.innerHTML = "实例" + key;
      $$("#glcanvas").scrollIntoView({
        behavior: "smooth",
      });
      setTimeout(() => {
        fun.call(this);
      }, 500);
    } else {
      alert(
        `未找到实例${key}的回调函数, 请在 src/app/exampleMap.ts 中配置映射表 ExampleMap`
      );
    }
  }
}

/**
 * 实例返回按钮事件初始化
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
    const target = (e.target as Element).getAttribute("path");
    target && loadDocs(target);
    e.preventDefault();
  }
}

/**
 * 初始化事件
 * @description 画布刷新时需要调用
 */
export function initEvent() {
  exampleEventInit();
  exampleBackBtnEventInit();
  pathAnchorEventInit();
}

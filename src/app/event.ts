import { $$, $$$ } from "../utils/xml";
import { getExampleCall } from "./exampleMap";

/**示例返回按钮选择器 */
const keyBackBtnSelector = "#canvas .info .key";

/**
 * 示例按钮事件初始化
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
      keyBackBtn.innerHTML = "示例" + key;
      $$("#glcanvas").scrollIntoView({
        behavior: "smooth",
      });
      setTimeout(() => {
        fun.call(this);
      }, 1000);
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
    const keyEle = key && $$(`[key="${key}"].example`);
    keyEle &&
      keyEle.scrollIntoView({
        behavior: "smooth",
      });
  });
}

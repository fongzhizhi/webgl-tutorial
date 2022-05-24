import "./styles/main.less";
import "./styles/github-markdown.less";
import "github-markdown-css/github-markdown.css";
import "highlight.js/styles/vs.css";
import { marked } from "marked";
import hljs from "highlight.js";
import { $$ } from "./utils/xml";
import { ExampleMap } from "./app/exampleMap";
import { historyEventInit } from "./app/event";
import { loadDocByUrl } from "./utils/router";

window.onload = async () => {
  init();
  await loadDocByUrl();
  canvasDraw();
  showExample("");
};

/**展示示例 */
function showExample(key: string) {
  const el = $$(`[key="${key}"].example`) as HTMLElement;
  if (el) {
    el.click();
  } else {
    ExampleMap["base_8"].call(this);
  }
}

/**
 * 相关初始化
 */
function init() {
  historyEventInit();
  initMarked();
}

/**
 * marked 配置初始化
 */
function initMarked() {
  marked.setOptions({
    renderer: new marked.Renderer(),
    gfm: true,
    pedantic: false,
    sanitize: false,
    breaks: true,
    smartLists: true,
    smartypants: true,
    highlight: function (code) {
      return hljs.highlightAuto(code).value;
    },
  });
}

/**
 * 绘制canvas
 */
function canvasDraw() {
  $$("#canvas").classList.remove("hidden");
}

import "./styles/main.less";
import "./styles/github-markdown.less";
import "github-markdown-css/github-markdown.css";
import "highlight.js/styles/vs.css";
import { marked } from "marked";
import hljs from "highlight.js";
import { printStyleLog } from "./utils/util";
import axios from "axios";
import { $$, $$$ } from "./utils/xml";
import { exampleBackBtnEventInit, exampleEventInit } from "./app/event";

window.onload = async () => {
  init();
  const path = "docs/WebGL基础.md";
  await loadDocs(path);
  initEvent();
  canvasDraw();
  showExample("2");
};

/**展示示例 */
function showExample(key: string) {
  const el = $$(`[key="${key}"].example`) as HTMLElement;
  el && el.click();
}

/**
 * 加载文档
 * @param path 文档相对路径(相对于根目录)
 */
async function loadDocs(path?: string) {
  await axios
    .get("http://localhost:3030/docs/" + path.replace(/\//g, "__"))
    .then((res) => {
      if (res && res.data) {
        const docsHtml = marked(res.data, {});
        document.getElementById("docs").innerHTML = docsHtml;
      }
    })
    .catch((err) => {
      printStyleLog("Server Error", err);
    });
}

/**
 * 相关初始化
 */
function init() {
  initMarked();
}

/**
 * 事件初始化
 */
function initEvent() {
  exampleEventInit();
  exampleBackBtnEventInit();
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

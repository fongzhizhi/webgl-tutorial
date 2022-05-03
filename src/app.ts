import "./styles/main.less";
import "./styles/github-markdown.less";
import "github-markdown-css/github-markdown.css";
import "highlight.js/styles/vs.css";
import { marked } from "marked";
import hljs from "highlight.js";
import { printStyleLog } from "./utils/util";
import axios from "axios";
import { getWebGLContext } from "./examples/1.webglContext";
import { $$ } from "./utils/xml";
import { exampleBackBtnEventInit, exampleEventInit } from "./app/event";

window.onload = async () => {
  init();
  await loadReadme();
  initEvent();
  canvasDraw();
};

/**
 * 加载readme文档
 */
async function loadReadme() {
  await axios
    .get("http://localhost:3030/readme")
    .then((res) => {
      if (res && res.data) {
        const readMeHtml = marked(res.data, {});
        document.getElementById("readme").innerHTML = readMeHtml;
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

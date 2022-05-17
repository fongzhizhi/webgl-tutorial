import axios from "axios";
import { marked } from "marked";
import { initEvent } from "../app/event";
import { printStyleLog } from "./util";

/**
 * 加载文档
 * @param path 文档相对路径(相对于根目录)
 */
export async function loadDocs(path?: string) {
  await axios
    .get("http://localhost:3030/docs/" + path.replace(/\//g, "__"))
    .then((res) => {
      if (res && res.data) {
        const docsHtml = marked(res.data, {});
        document.getElementById("docs").innerHTML = docsHtml;
        initEvent();
      }
    })
    .catch((err) => {
      printStyleLog("Server Error", err);
    });
}

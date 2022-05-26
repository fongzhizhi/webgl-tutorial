import axios from "axios";
import { marked } from "marked";
import { eventInit } from "../app/event";
import { RouterMap } from "../app/router";
import { printStyleLog } from "./util";
import { $$ } from "./xml";

/**
 * 加载文档
 * @param path 文档相对路径(相对于根目录)
 */
export async function loadDocs(path?: RouterMap) {
  path = path || RouterMap.Index;
  await axios
    .get("http://localhost:3030/" + (path || "index"))
    .then((res) => {
      if (res && res.data) {
        const docsHtml = marked(res.data, {});
        document.getElementById("docs").innerHTML = docsHtml;
        eventInit();
        if (location.hash) {
          loadDocByUrl();
        }
      }
    })
    .catch((err) => {
      printStyleLog("Something Error", err);
    });
}

let oldUrl: string = null;
/**
 * 根据当前url加载文档
 */
export async function loadDocByUrl() {
  const url = location.pathname.replace("/", "");
  if (oldUrl === url) {
    if (location.hash) {
      const anchor = $$(decodeURIComponent(location.hash));
      anchor &&
        anchor.scrollIntoView({
          behavior: "smooth",
        });
    }
    return;
  }
  oldUrl = url;
  await loadDocs(url as RouterMap);
}

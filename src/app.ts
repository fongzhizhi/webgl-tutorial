import "./styles/main.less";
import { printStyleLog } from "./utils/util";
import axios from "axios";
import { marked } from "marked";

window.onload = () => {
  loadReadme();
  doSomething();
};

function loadReadme() {
  axios
    .get("http://localhost:3030/readme")
    .then((res) => {
      if (res && res.data) {
        const readMeHtml = marked(res.data);
        document.getElementById("readme").innerHTML = readMeHtml;
      }
    })
    .catch((err) => {
      printStyleLog("Server Error", err);
    });
}

/**
 * print something
 */
function doSomething() {
  printStyleLog(
    "Jinx",
    {
      name: "Jinx",
      age: 21,
    },
    {
      color: "#41b883",
    }
  );
}

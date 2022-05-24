const express = require("express");
const fs = require("fs");
const _path = require("path");

function server() {
  const app = express();

  //设置允许跨域访问该服务.
  app.all("*", function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.header("Access-Control-Allow-Methods", "*");
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
  });

  const port = 3030;
  app.use(express.static("dest"));

  const RouterMap = {
    "": "README.MD",
    index: "README.MD",
    base: "docs/WebGL基础.md",
    advance: "docs/WebGL进阶.md",
    examples: "docs/WebGL案例.md",
  };
  app.get("/:path", (req, res) => {
    const path = req.params.path;
    console.log("[get]", path);
    const filePath = _path.resolve(
      __dirname,
      RouterMap[path] || RouterMap.index
    );
    res.send(fs.readFileSync(filePath, "utf-8"));
  });
  app.listen(port, () => {
    const url = `http://localhost:${port}`;
    console.log("[server running]", `App listening at ${url}`);
  });
}

server();

const express = require("express");
const fs = require("fs");
const path = require("path");

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
  app.get("/readme", (req, res) => {
    res.send(fs.readFileSync(path.resolve(__dirname, "README.md")).toString());
  });
  app.listen(port, () => {
    const url = `http://localhost:${port}`;
    console.log("[server running]", `App listening at ${url}`);
  });
}

server();

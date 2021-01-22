const port = 8080;
const json_port = 3002;
const db_file = "db.json";

const path = require("path");
const jsonServer = require("json-server");
const server = jsonServer.create();

server.use(jsonServer.defaults());
server.use(jsonServer.router(path.join(__dirname, "../data/db.json")));
server.listen(json_port, () => {
  console.log("JSON Server is running");
});

//
const { createProxyMiddleware } = require("http-proxy-middleware");
const express = require("express");
const app = express();

app.use(express.static("dist"));
app.use(
  "/api",
  createProxyMiddleware({
    target: `http://localhost:${json_port}/`,
    changeOrigin: true,
    pathRewrite: {
      [`^/api`]: "",
    },
  })
);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

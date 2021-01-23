// parameters
const port = 8080;
const json_port = 3002;
const db_name = "../data/db.json";
const js_path = "dist";
const use_json_server = true;
const real_backend = "http://backend:8080/";

// launch
const path = require("path");
const db_path = path.join(__dirname, db_name);

const jsonServer = require("json-server");
const server = jsonServer.create();

server.use(jsonServer.defaults());
server.use(jsonServer.router(db_path));

const { createProxyMiddleware } = require("http-proxy-middleware");
const express = require("express");
const app = express();

app.use(express.static(js_path));
if (use_json_server) {
  server.listen(json_port, () => {
    console.log(`[INFO] JSON Server is running at http://localhost:${json_port}`);
  });
  console.log("[INFO] /api redirect to json-server");
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
} else {
  console.log("[INFO] /api redirect to backend: " + real_backend);
  app.use(
    "/api",
    createProxyMiddleware({
      target: real_backend,
      changeOrigin: true,
    })
  );
}

app.listen(port, () => {
  console.log(`[INFO] App listening at http://localhost:${port}`);
});

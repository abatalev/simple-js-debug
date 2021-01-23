// parameters
const port = 8080;
const jsonPort = 3002;
const dbName = "../data/db.json";
const jsPath = "dist";
const useJsonServer = true;
const realBackend = "http://backend:8080/";

// launch json-server
const path = require("path");
const dbPath = path.join(__dirname, dbName);

const jsonServer = require("json-server");
const server = jsonServer.create();

server.use(jsonServer.defaults());
server.use(jsonServer.router(dbPath));

// launch express
const { createProxyMiddleware } = require("http-proxy-middleware");
const express = require("express");
const app = express();

app.use(express.static(jsPath));
if (useJsonServer) {
  server.listen(jsonPort, () => {
    console.log(`[INFO] JSON Server is running at http://localhost:${jsonPort}`);
  });
  console.log("[INFO] /api redirect to json-server");
  app.use(
    "/api",
    createProxyMiddleware({
      target: `http://localhost:${jsonPort}/`,
      changeOrigin: true,
      pathRewrite: {
        [`^/api`]: "",
      },
    })
  );
} else {
  console.log("[INFO] /api redirect to backend: " + realBackend);
  app.use(
    "/api",
    createProxyMiddleware({
      target: realBackend,
      changeOrigin: true,
    })
  );
}

app.listen(port, () => {
  console.log(`[INFO] App listening at http://localhost:${port}`);
});

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api/appwrite": {
        target: "https://cloud.appwrite.io/v1",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/appwrite/, ""),
        configure: (proxy, _options) => {
          proxy.on("proxyRes", (proxyRes, req, res) => {
            // Add CORS headers
            res.setHeader(
              "Access-Control-Allow-Origin",
              "http://localhost:5173"
            );
            res.setHeader("Access-Control-Allow-Credentials", "true");
            res.setHeader(
              "Access-Control-Allow-Methods",
              "GET, POST, PUT, DELETE, OPTIONS"
            );
            res.setHeader(
              "Access-Control-Allow-Headers",
              "Origin, X-Requested-With, Content-Type, Accept, Authorization"
            );
          });

          // Handle preflight requests
          proxy.on("proxyReq", (proxyReq, req, res) => {
            if (req.method === "OPTIONS") {
              res.writeHead(200, {
                "Access-Control-Allow-Origin": "http://localhost:5173",
                "Access-Control-Allow-Credentials": "true",
                "Access-Control-Allow-Methods":
                  "GET, POST, PUT, DELETE, OPTIONS",
                "Access-Control-Allow-Headers":
                  "Origin, X-Requested-With, Content-Type, Accept, Authorization",
              });
              res.end();
            }
          });
        },
      },
    },
  },
});

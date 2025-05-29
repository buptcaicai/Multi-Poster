import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

const chromeDevPlugin = () => ({
  name: 'chromeDevPlugin',
  configureServer(server: any) {
    server.middlewares.use((req:any, res:any, next:any) => {
      if (req.url === '/.well-known/appspecific/com.chrome.devtools.json') {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({
          devtools_page: 'http://localhost:9222/devtools/inspector.html'
        }));
      } else {
        next();
      }
    })
  }
})

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths(), chromeDevPlugin()]
});

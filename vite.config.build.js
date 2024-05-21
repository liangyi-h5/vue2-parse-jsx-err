import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue2'
import { fileURLToPath, URL } from "node:url"
import copy from "rollup-plugin-copy"

// https://vitejs.dev/config/
export default defineConfig({
  base: "/",
  plugins: [
    vue(),
    copy({
      targets: [
        { src: "server/public", dest: "dist" },
        { src: "server/html", dest: "dist" }
      ],
      verbose: true,
      hook: "writeBundle"
    })
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url))
    }
  },
})

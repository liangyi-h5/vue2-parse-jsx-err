import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue2'
import vueJsx from './vue2-parse-jsx'
// import vueJsx from 'plugin-vue2-jsx-vite5'

import { fileURLToPath, URL } from "node:url"

// https://vitejs.dev/config/
export default defineConfig({
  base: "/",
  plugins: [vue(), vueJsx({
    include: [/\.[jt]sx$/, /\.[jt]s$/, /\.vue$/],
    extends: [/\.css$/]
  })],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url))
    }
  },
  esbuild: {
    loader: {
      '.js': 'jsx',
      '.vue': 'jsx',
    }
  },
  css: {
    preprocessorOptions: {
    }
  },
  optimizeDeps: {
    include: [
      'babel-plugin-transform-vue-jsx'
    ]
  }
})

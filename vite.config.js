import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue2'
// import vueJsx from './vue2-parse-jsx'
import vueJsx from '@vitejs/plugin-vue2-jsx'
import { fileURLToPath, URL } from "node:url"

// https://vitejs.dev/config/
export default defineConfig({
  base: "/",
  plugins: [vue(), vueJsx({
    include: [/\.[jt]sx$/, /\.vue$/]
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
  optimizeDeps: {
    include: [
      '@vue/babel-preset-jsx',
      'babel-plugin-transform-vue-jsx'
    ]
  }
})

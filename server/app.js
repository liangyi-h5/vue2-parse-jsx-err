import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import express from 'express'

// 在ts文件里不能直接使用__dirname，所以需要使用这种方法
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const resolve = (p) => {
  return path.resolve(__dirname, p)
}

const templateHtmlUrl = resolve('./public/client/index.html')
const ssrManifestUrl = resolve('./public/client/.vite/ssr-manifest.json')
const sirvUrl = resolve("./public/client");

const createAppServer = async () => {
  // Constants
  const isProduction = process.env.NODE_ENV === 'production'
  const port = process.env.PORT || 5173
  const base = process.env.BASE || '/'
  const templateHtml = isProduction
    ? await fs.readFile(templateHtmlUrl, 'utf-8')
    : ''
  const ssrManifest = isProduction
    ? await fs.readFile(ssrManifestUrl, 'utf-8')
    : undefined

  // Create http server
  const app = express()

  let vite
  if (!isProduction) {
    const { createServer } = await import('vite')
    vite = await createServer({
      server: { middlewareMode: true },
      appType: 'custom',
      base
    })
    app.use(vite.middlewares)
  } else {
    const compression = (await import('compression')).default
    const sirv = (await import('sirv')).default
    app.use(compression())
    app.use(base, sirv(sirvUrl, { extensions: [] }))
  }

  // Serve HTML
  app.use('*', async (req, res) => {
    try {
      const url = req.originalUrl.replace(base, '')

      let template
      let render
      if (!isProduction) {
        // Always read fresh template in development
        template = await fs.readFile('./index.html', 'utf-8')
        template = await vite.transformIndexHtml(url, template)
        render = (await vite.ssrLoadModule('/src/entry-server.js')).render
      } else {
        template = templateHtml
        // @ts-ignore
        render = (await import('./public/server/entry-server.js')).render
      }

      const rendered = await render(url, ssrManifest)
      const html = template
        .replace(`<!--app-head-->`, rendered.head ?? '')
        .replace(`<!--app-html-->`, rendered.html ?? '')

      res.status(200).set({ 'Content-Type': 'text/html' }).send(html)
    } catch (e) {
      vite?.ssrFixStacktrace(e)
      res.status(500).end(e.stack)
    }
  })

  // Start http server
  app.listen(port, () => {
    console.log(`\x1B[42;30m 服务启动成功:\x1B[0;32m \x1B[4mhttp://localhost:${port}\x1B[0m`);
  })
}
createAppServer()
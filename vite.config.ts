import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import app from './api/app'

function honoApiDev(): Plugin {
  return {
    name: 'hono-api-dev',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/')) {
          next()
          return
        }

        try {
          const host = req.headers.host ?? 'localhost:5173'
          const headers = new Headers()
          for (const [key, value] of Object.entries(req.headers)) {
            if (typeof value === 'string') headers.set(key, value)
            else if (Array.isArray(value)) value.forEach((item) => headers.append(key, item))
          }

          const chunks: Buffer[] = []
          for await (const chunk of req) chunks.push(Buffer.from(chunk))
          const method = req.method ?? 'GET'
          const request = new Request(new URL(req.url, `http://${host}`), {
            method,
            headers,
            body: method === 'GET' || method === 'HEAD' ? undefined : Buffer.concat(chunks),
          })

          const response = await app.fetch(request)
          res.statusCode = response.status
          response.headers.forEach((value, key) => res.setHeader(key, value))
          res.end(Buffer.from(await response.arrayBuffer()))
        } catch (error) {
          next(error as Error)
        }
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), honoApiDev()],
})

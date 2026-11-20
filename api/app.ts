import { Hono } from 'hono'
import { CHAPTERS, PROFILE, STATUS_ORDER, WORKS } from '../src/data'

const INKS = ['blue-black', 'crimson', 'sepia'] as const

const app = new Hono().basePath('/api')

app.use('*', async (c, next) => {
  await next()
  c.res.headers.set('X-Content-Type-Options', 'nosniff')
  c.res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  c.res.headers.set('Cache-Control', 'no-store')
})

app.get('/health', (c) =>
  c.json({ ok: true, service: 'tatsuya-tech-portfolio', runtime: 'hono', time: new Date().toISOString() }),
)

app.get('/profile', (c) =>
  c.json({ name: PROFILE.name, tagline: PROFILE.tagline, role: PROFILE.role, github: PROFILE.github }),
)

app.get('/chapters', (c) => c.json({ chapters: CHAPTERS }))

app.get('/works', (c) => {
  const counts = Object.fromEntries(
    STATUS_ORDER.map((status) => [status, WORKS.filter((work) => work.status === status).length]),
  )
  return c.json({
    total: WORKS.length,
    counts,
    works: WORKS.map(({ id, title, status, category, summary }) => ({ id, title, status, category, summary })),
  })
})

app.get('/works/:id', (c) => {
  const work = WORKS.find((item) => item.id === c.req.param('id'))
  return work ? c.json({ work }) : c.json({ error: '作品が見つかりません' }, 404)
})

app.post('/memo', async (c) => {
  const payload = await c.req.json().catch(() => null)
  const text = typeof payload?.text === 'string' ? payload.text.trim() : ''
  const ink = typeof payload?.ink === 'string' && INKS.includes(payload.ink as (typeof INKS)[number])
    ? payload.ink
    : 'blue-black'

  if (!text || text.length > 280) {
    return c.json({ error: '一行は 1〜280 字で書いてください' }, 400)
  }

  return c.json({
    id: crypto.randomUUID(),
    text,
    ink,
    receivedAt: new Date().toISOString(),
    note: '預かった一行は、この場にだけ表示されます。保存はされません。',
  })
})

app.notFound((c) => c.json({ error: '見つかりません' }, 404))
app.onError((_error, c) => c.json({ error: '手帳に不具合が起きました' }, 500))

export default app

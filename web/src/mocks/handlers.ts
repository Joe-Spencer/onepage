import { http, HttpResponse } from 'msw'

export const handlers = [
  http.get('/api/metrics', () => {
    const points = Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      value: Math.round(50 + Math.random() * 50),
    }))
    return HttpResponse.json(points)
  }),
  http.get('/api/items', ({ request }) => {
    const url = new URL(request.url)
    const offset = Number(url.searchParams.get('offset') ?? '0')
    const limit = Number(url.searchParams.get('limit') ?? '50')
    const items = Array.from({ length: limit }, (_, i) => {
      const id = offset + i
      return { id, name: `Item ${id}`, value: Math.round(Math.random() * 1000) }
    })
    const total = 10000
    return HttpResponse.json({ items, total })
  }),
]



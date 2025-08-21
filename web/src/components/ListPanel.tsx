import { useMemo, useState } from 'react'
import { FixedSizeList as List } from 'react-window'
import { polishNameForId, mulberry32 } from '../lib/names'

type Item = { id: number; name: string; value: number }


function PixelIcon({ seed, size = 32 }: { seed: number; size?: number }) {
  const rnd = mulberry32(seed * 1013904223)
  const cells = 5
  const cellSize = Math.floor(size / cells)
  const hue = Math.floor(rnd() * 360)
  const fg = `hsl(${hue} 80% 50%)`
  const bg = 'transparent'
  const rects: Array<{ x: number; y: number; fill: string }> = []

  for (let y = 0; y < cells; y++) {
    for (let x = 0; x < Math.ceil(cells / 2); x++) {
      const on = rnd() > 0.5
      const fill = on ? fg : bg
      const mx = cells - 1 - x
      rects.push({ x, y, fill })
      rects.push({ x: mx, y, fill })
    }
  }

  const view = cells * cellSize
  return (
    <svg width={view} height={view} viewBox={`0 0 ${view} ${view}`} style={{ borderRadius: 4, background: '#fff' }}>
      {rects.map((r, i) => (
        <rect key={i} x={r.x * cellSize} y={r.y * cellSize} width={cellSize} height={cellSize} fill={r.fill} />
      ))}
    </svg>
  )
}

function ListPanel() {
  const [query, setQuery] = useState('')
  const items = useMemo<Item[]>(() => {
    return Array.from({ length: 5000 }, (_, i) => ({ id: i, name: polishNameForId(i), value: Math.round(Math.random() * 1000) }))
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return items
    return items.filter((it) => it.name.toLowerCase().includes(q))
  }, [items, query])

  return (
    <div>
      <div style={{ marginBottom: 8 }}>
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Szukaj (Search)" style={{ padding: 8, width: '100%' }} />
      </div>
      <List height={320} width={'100%'} itemCount={filtered.length} itemSize={44}>
        {({ index, style }) => {
          const item = filtered[index]
          return (
            <div style={{ ...style, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <PixelIcon seed={item.id} size={32} />
                <span>{item.name}</span>
              </div>
              <span>{item.value}</span>
            </div>
          )
        }}
      </List>
    </div>
  )
}

export default ListPanel



import { useEffect, useRef, useState, useMemo } from 'react'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Brush, Legend, ReferenceLine } from 'recharts'
import { polishNameForId } from '../lib/names'

type Sample = { id: number; t: number; value: number }

function ChartsPanel() {
  const [streams, setStreams] = useState<number[]>([0, 1, 2, 3, 4])
  const [data, setData] = useState<Record<number, Sample[]>>({ 0: [], 1: [], 2: [], 3: [], 4: [] })
  const workerRef = useRef<Worker | null>(null)
  const WINDOW = 80 // wider window; faster movement

  useEffect(() => {
    const worker = new Worker(new URL('./StreamWorker.ts', import.meta.url), { type: 'module' })
    workerRef.current = worker
    const onMessage = (e: MessageEvent<any>) => {
      if (e.data?.type === 'batch') {
        setData((prev) => {
          const next: Record<number, Sample[]> = { ...prev }
          for (const s of e.data.data as Sample[]) {
            const arr = next[s.id] ? [...next[s.id]] : []
            arr.push(s)
            if (arr.length > 600) arr.shift()
            next[s.id] = arr
          }
          return next
        })
      }
    }
    worker.addEventListener('message', onMessage)
    worker.postMessage({ type: 'config', streamIds: streams })
    worker.postMessage({ type: 'start' })
    return () => {
      worker.removeEventListener('message', onMessage)
      worker.postMessage({ type: 'stop' })
      worker.terminate()
    }
  }, [streams])

  // Translate incoming points so latest sits at x=WINDOW; scroll right-to-left.
  const transformed = useMemo(() => {
    const result: Record<number, Array<Sample & { x: number }>> = {}
    const lastT = Math.max(
      ...streams.map((id) => (data[id]?.length ? data[id][data[id].length - 1].t : 0)),
    )
    for (const id of streams) {
      const arr = data[id] ?? []
      result[id] = arr
        .map((p) => ({ ...p, x: p.t - lastT + WINDOW }))
        .filter((p) => p.x >= 0 && p.x <= WINDOW)
    }
    return result
  }, [data, streams])

  const palette = ["#ef4444","#22c55e","#3b82f6","#f59e0b","#ec4899","#10b981","#8b5cf6"]

  return (
    <div style={{ height: 380 }}>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center', marginBottom: 8 }}>
        {streams.map((id, idx) => (
          <div key={id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ display: 'inline-block', width: 16, height: 6, background: palette[idx % palette.length], borderRadius: 3 }} />
            <span style={{ color: '#374151', fontSize: 12 }}>{polishNameForId(id)}</span>
          </div>
        ))}
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart syncId="stream">
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="x" type="number" domain={[0, WINDOW]} allowDataOverflow tickCount={0} stroke="#e5e7eb" tick={false} />
          <YAxis stroke="#374151" tick={{ fill: '#374151' }} />
          <Tooltip contentStyle={{ color: '#111827' }} />
          {streams.map((id, idx) => (
            <Line
              key={id}
              data={transformed[id] ?? []}
              dataKey="value"
              name={polishNameForId(id)}
              type="monotone"
              stroke={palette[idx % palette.length]}
              dot={false}
              strokeWidth={2.2}
              isAnimationActive={false}
            />
          ))}
          <ReferenceLine x={WINDOW} stroke="#9ca3af" />
          <Brush height={20} travellerWidth={8} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default ChartsPanel



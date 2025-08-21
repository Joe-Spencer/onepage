import { useQuery } from '@tanstack/react-query'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'
import { FixedSizeList as List } from 'react-window'
import type { ListChildComponentProps } from 'react-window'

function Dashboard() {
  const metricsQuery = useQuery({
    queryKey: ['metrics'],
    queryFn: async () => {
      const res = await fetch('/api/metrics')
      if (!res.ok) throw new Error('Failed to fetch metrics')
      return (await res.json()) as { hour: number; value: number }[]
    },
  })

  const itemsQuery = useQuery({
    queryKey: ['items', 0],
    queryFn: async () => {
      const res = await fetch('/api/items?offset=0&limit=1000')
      if (!res.ok) throw new Error('Failed to fetch items')
      return (await res.json()) as { items: { id: number; name: string; value: number }[] }
    },
  })

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 24 }}>
      <section>
        <h1 style={{ marginBottom: 12 }}>Metrics</h1>
        <div style={{ height: 300, background: 'white', borderRadius: 8, padding: 12 }}>
          {metricsQuery.isLoading ? (
            <div>Loading chart...</div>
          ) : metricsQuery.isError ? (
            <div>Error loading metrics</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={metricsQuery.data ?? []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </section>

      <section>
        <h2 style={{ marginBottom: 12 }}>Items</h2>
        <div style={{ height: 360, background: 'white', borderRadius: 8, padding: 12 }}>
          {itemsQuery.isLoading ? (
            <div>Loading items...</div>
          ) : itemsQuery.isError ? (
            <div>Error loading items</div>
          ) : (
            // Safely default to empty list if data is missing
            (() => {
              const items = itemsQuery.data?.items ?? []
              return (
            <List
              height={320}
              width={'100%'}
              itemCount={items.length}
              itemSize={36}
            >
              {({ index, style }: ListChildComponentProps) => {
                const item = items[index]
                return item ? (
                  <div style={{ ...style, display: 'flex', justifyContent: 'space-between' }}>
                    <span>{item.name}</span>
                    <span>{item.value}</span>
                  </div>
                ) : null
              }}
            </List>
              )
            })()
          )}
        </div>
      </section>
    </div>
  )
}

export default Dashboard



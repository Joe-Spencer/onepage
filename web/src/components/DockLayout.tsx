import { useEffect, useMemo, useState } from 'react'
import { Responsive, WidthProvider } from 'react-grid-layout'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'

const ResponsiveGridLayout = WidthProvider(Responsive)

type DockLayoutProps = {
  panels: Record<string, { title: string; element: JSX.Element }>
}

const STORAGE_KEY = 'onepage_layout_v1'

function DockLayout({ panels }: DockLayoutProps) {
  const keys = Object.keys(panels)
  const defaultLayouts = useMemo(() => ({
    lg: [
      { i: keys[0], x: 0, y: 0, w: 6, h: 12 },
      { i: keys[1], x: 6, y: 0, w: 6, h: 12 },
      { i: keys[2], x: 0, y: 12, w: 12, h: 12 },
    ],
    md: [
      { i: keys[0], x: 0, y: 0, w: 10, h: 12 },
      { i: keys[1], x: 0, y: 12, w: 10, h: 12 },
      { i: keys[2], x: 0, y: 24, w: 10, h: 12 },
    ],
    sm: [
      { i: keys[0], x: 0, y: 0, w: 6, h: 12 },
      { i: keys[1], x: 0, y: 12, w: 6, h: 12 },
      { i: keys[2], x: 0, y: 24, w: 6, h: 12 },
    ],
  }), [keys])

  const [layouts, setLayouts] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : defaultLayouts
    } catch {
      return defaultLayouts
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(layouts))
  }, [layouts])

  return (
    <ResponsiveGridLayout
      className="layout"
      layouts={layouts}
      onLayoutsChange={setLayouts}
      breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
      cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
      rowHeight={24}
      draggableHandle=".panel-title"
    >
      {keys.map((key) => (
        <div key={key} className="glass-card" style={{ borderRadius: 12, overflow: 'hidden' }}>
          <div className="panel-title" style={{ padding: '8px 12px', fontWeight: 700, borderBottom: '1px solid #e5e7eb', cursor: 'move' }}>
            {panels[key].title}
          </div>
          <div style={{ padding: 12 }}>
            {panels[key].element}
          </div>
        </div>
      ))}
    </ResponsiveGridLayout>
  )
}

export default DockLayout



import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars, Sparkles } from '@react-three/drei'
import { EffectComposer, Bloom, ChromaticAberration, Glitch } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import type { RootState } from '../store'
import { useMemo, useState } from 'react'
import ThemeProvider from './ThemeProvider'
import { useDispatch, useSelector } from 'react-redux'
import { toggleTheme } from '../store'
import Dashboard from '../pages/Dashboard'
import ControlsPanel from './ControlsPanel'
import DockLayout from './DockLayout'
import ChartsPanel from './ChartsPanel'
import ListPanel from './ListPanel'
// import RandomModel from './RandomModel'

function RainbowBackground() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: -2,
        background: 'conic-gradient(from 180deg at 50% 50%, #ff0080, #ff8c00, #ffee00, #00ff85, #00c2ff, #8a2be2, #ff0080)',
        filter: 'blur(60px) saturate(1.4)',
        opacity: 0.45,
      }}
    />
  )
}

function Cube() {
  return (
    <mesh rotation={[0.6, 0.6, 0]}>
      <boxGeometry args={[1.5, 1.5, 1.5]} />
      <meshStandardMaterial color="#ffffff" metalness={0.4} roughness={0.2} />
    </mesh>
  )
}

import ProceduralModel, { type ProcShape } from './ProceduralModel'

function Scene3D({ shape }: { shape: ProcShape }) {
  const effects = useSelector((s: RootState) => s.effects)
  return (
    <Canvas camera={{ position: [3, 3, 3], fov: 50 }} style={{ height: 360, width: '100%', borderRadius: 12, background: '#0b1220' }}>
      <ambientLight intensity={0.7} />
      <directionalLight position={[3, 5, 2]} intensity={1} />
      <Stars radius={50} depth={20} count={2000} factor={4} fade />
      <Sparkles count={200} speed={0.6} opacity={0.8} color="#ffffff" />
      <ProceduralModel shape={shape} />

      <EffectComposer>
        {effects.bloom && <Bloom intensity={0.6} luminanceThreshold={0.2} luminanceSmoothing={0.1} />}
        {effects.chromaticAberration && <ChromaticAberration blendFunction={BlendFunction.NORMAL} offset={[0.001, 0.001]} />}
        {effects.glitch && <Glitch delay={[1.5, 3.5]} duration={[0.2, 0.6]} strength={[0.1, 0.3]} />}
      </EffectComposer>

      <OrbitControls enableDamping />
    </Canvas>
  )
}

function ComplexPage() {
  const sections = useMemo(() => [
    { id: 'hero', title: 'Hero 3D' },
    { id: 'dashboard', title: 'Data Dashboard' },
  ], [])

  const dispatch = useDispatch()
  const theme = useSelector((s: RootState) => s.ui.theme)
  const [shape, setShape] = useState<ProcShape>('torus')

  return (
    <ThemeProvider>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, padding: 24 }}>
      <div style={{ position: 'fixed', top: 8, right: 8, background: '#84cc16', color: '#111827', padding: '6px 10px', borderRadius: 6, fontWeight: 700, zIndex: 1 }}>
        Rendering OK
      </div>
      <RainbowBackground />
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0 }}>The most complex single page application EVER</h1>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          {sections.map((s) => (
            <a key={s.id} href={`#${s.id}`} style={{ fontWeight: 600 }}>{s.title}</a>
          ))}
          <button
            onClick={() => dispatch(toggleTheme())}
            style={{
              padding: '6px 12px',
              borderRadius: 8,
              border: theme === 'light' ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.2)',
              background: theme === 'light' ? '#ffffff' : '#111827',
              color: theme === 'light' ? '#111827' : 'rgba(255,255,255,0.92)',
              boxShadow: theme === 'light' ? '0 1px 2px rgba(0,0,0,0.04)' : '0 1px 2px rgba(0,0,0,0.5)',
              transition: 'background 150ms ease, color 150ms ease, border-color 150ms ease',
              cursor: 'pointer',
            }}
          >
            {theme === 'light' ? 'Dark mode' : 'Light mode'}
          </button>
        </div>
      </header>

      <section id="hero" className="glass-card" style={{ borderRadius: 12, padding: 12 }}>
        <h2>Interactive 3D</h2>
        <div style={{ marginBottom: 12 }}>
          <ControlsPanel />
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 8 }}>
          <label style={{ fontWeight: 600 }}>Shape:</label>
          <select value={shape} onChange={(e) => setShape(e.target.value as ProcShape)} style={{ padding: '6px 10px', borderRadius: 8 }}>
            <option value="torus">torus</option>
            <option value="box">box</option>
            <option value="pyramid">pyramid</option>
          </select>
        </div>
        <Scene3D shape={shape} />
        <p>Drag to orbit. Stars, sparkles, and glossy shapes with lights.</p>
      </section>

      <section id="dashboard" className="glass-card" style={{ borderRadius: 12, padding: 12 }}>
        <h2>Live Data</h2>
        <DockLayout panels={{
          charts: { title: 'Streaming Charts', element: <ChartsPanel /> },
          list: { title: 'Big Virtualized List', element: <ListPanel /> },
          apiDemo: { title: 'Mocked API Demo', element: <Dashboard /> },
        }} />
      </section>
    </div>
    </ThemeProvider>
  )
}

export default ComplexPage



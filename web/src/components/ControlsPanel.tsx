import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from '../store'
import { toggleBloom, toggleChromaticAberration, toggleGlitch, togglePhysics } from '../store'

function ControlsPanel() {
  const dispatch = useDispatch()
  const effects = useSelector((s: RootState) => s.effects)

  return (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
      <label><input type="checkbox" checked={effects.bloom} onChange={() => dispatch(toggleBloom())} /> Bloom</label>
      <label><input type="checkbox" checked={effects.chromaticAberration} onChange={() => dispatch(toggleChromaticAberration())} /> Chromatic</label>
      <label><input type="checkbox" checked={effects.glitch} onChange={() => dispatch(toggleGlitch())} /> Glitch</label>
      <label><input type="checkbox" checked={effects.physics} onChange={() => dispatch(togglePhysics())} /> Physics</label>
    </div>
  )
}

export default ControlsPanel



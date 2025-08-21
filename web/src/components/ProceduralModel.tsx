import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export type ProcShape = 'torus' | 'box' | 'pyramid'

export default function ProceduralModel({ shape, color = '#ffffff', metalness = 0.4, roughness = 0.25 }: { shape: ProcShape, color?: string, metalness?: number, roughness?: number }) {
  const ref = useRef<THREE.Group>(null)
  useFrame((_s, d) => {
    if (ref.current) ref.current.rotation.y += d * 0.3
  })

  return (
    <group ref={ref}>
      {shape === 'torus' && (
        <mesh>
          <torusGeometry args={[1, 0.35, 16, 48]} />
          <meshStandardMaterial color={color} metalness={metalness} roughness={roughness} />
        </mesh>
      )}
      {shape === 'box' && (
        <mesh>
          <boxGeometry args={[1.8, 1.8, 1.8]} />
          <meshStandardMaterial color={color} metalness={metalness} roughness={roughness} />
        </mesh>
      )}
      {shape === 'pyramid' && (
        <mesh>
          <coneGeometry args={[1.6, 2.2, 4]} />
          <meshStandardMaterial color={color} metalness={metalness} roughness={roughness} />
        </mesh>
      )}
    </group>
  )
}



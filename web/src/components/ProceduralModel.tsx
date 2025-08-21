import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export type ProcShape = 'torus' | 'box' | 'pyramid'

export default function ProceduralModel({ shape }: { shape: ProcShape }) {
  const ref = useRef<THREE.Group>(null)
  useFrame((_s, d) => {
    if (ref.current) ref.current.rotation.y += d * 0.3
  })

  return (
    <group ref={ref}>
      {shape === 'torus' && (
        <mesh>
          <torusGeometry args={[1, 0.35, 16, 48]} />
          <meshStandardMaterial color="#ffffff" metalness={0.4} roughness={0.2} />
        </mesh>
      )}
      {shape === 'box' && (
        <mesh>
          <boxGeometry args={[1.8, 1.8, 1.8]} />
          <meshStandardMaterial color="#ffffff" metalness={0.3} roughness={0.3} />
        </mesh>
      )}
      {shape === 'pyramid' && (
        <mesh>
          <coneGeometry args={[1.6, 2.2, 4]} />
          <meshStandardMaterial color="#ffffff" metalness={0.35} roughness={0.25} />
        </mesh>
      )}
    </group>
  )
}



import { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
import { MODEL_CHOICES, Choice } from '../lib/models'
import * as THREE from 'three'

// Choices imported from lib

function centerAndScaleToUnit(object: THREE.Object3D, targetSize = 2) {
  const box = new THREE.Box3().setFromObject(object)
  const size = new THREE.Vector3()
  box.getSize(size)
  const maxDim = Math.max(size.x, size.y, size.z)
  const scale = targetSize / (maxDim || 1)
  object.scale.setScalar(scale)
  box.setFromObject(object)
  const center = new THREE.Vector3()
  box.getCenter(center)
  object.position.sub(center)
}

export default function RandomModel({ choice: forcedChoice }: { choice?: Choice }) {
  const choice = useMemo(() => forcedChoice ?? MODEL_CHOICES[Math.floor(Math.random() * MODEL_CHOICES.length)], [forcedChoice])
  const groupRef = useRef<THREE.Group>(null)
  const [obj, setObj] = useState<THREE.Object3D | null>(null)

  useFrame((_state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.3
    }
  })

  // If procedural, render directly
  if (choice.kind === 'proc') {
    return (
      <group ref={groupRef}>
        {choice.shape === 'torus' && (
          <mesh>
            <torusGeometry args={[1, 0.35, 16, 48]} />
            <meshStandardMaterial color="#ffffff" metalness={0.4} roughness={0.2} />
          </mesh>
        )}
        {choice.shape === 'box' && (
          <mesh>
            <boxGeometry args={[1.8, 1.8, 1.8]} />
            <meshStandardMaterial color="#ffffff" metalness={0.3} roughness={0.3} />
          </mesh>
        )}
        {choice.shape === 'pyramid' && (
          <mesh>
            <coneGeometry args={[1.6, 2.2, 4]} />
            <meshStandardMaterial color="#ffffff" metalness={0.35} roughness={0.25} />
          </mesh>
        )}
      </group>
    )
  }

  // OBJ path: fetch and parse manually; fallback to torus on failure
  useEffect(() => {
    let active = true
    async function load() {
      try {
        const res = await fetch(choice.url)
        if (!res.ok) throw new Error('Failed to load OBJ')
        const text = await res.text()
        const loader = new OBJLoader()
        const parsed = loader.parse(text)
        parsed.traverse((child: any) => {
          if (child.isMesh) {
            child.material = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.4, roughness: 0.2 })
            child.castShadow = child.receiveShadow = true
          }
        })
        centerAndScaleToUnit(parsed)
        if (active) setObj(parsed)
      } catch (e) {
        if (active) setObj(null)
      }
    }
    load()
    return () => {
      active = false
    }
  }, [choice])

  if (!obj) {
    // Fallback procedural torus while loading/error
    return (
      <group ref={groupRef}>
        <mesh>
          <torusGeometry args={[1, 0.35, 16, 48]} />
          <meshStandardMaterial color="#ffffff" metalness={0.4} roughness={0.2} />
        </mesh>
      </group>
    )
  }

  return <primitive ref={groupRef as any} object={obj} />
}



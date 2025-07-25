import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sphere, Text } from '@react-three/drei'
import * as THREE from 'three'
import { Globe3DProps, GroundwaterData } from '../types/groundwater'

// Convert lat/lng to 3D coordinates on sphere
function latLngToVector3(lat: number, lng: number, radius: number = 2): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lng + 180) * (Math.PI / 180)
  
  const x = -(radius * Math.sin(phi) * Math.cos(theta))
  const z = radius * Math.sin(phi) * Math.sin(theta)
  const y = radius * Math.cos(phi)
  
  return new THREE.Vector3(x, y, z)
}

// Individual data point component
function DataPoint({ 
  point, 
  onClick, 
  isSelected 
}: { 
  point: GroundwaterData
  onClick: (point: GroundwaterData) => void
  isSelected: boolean 
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const position = latLngToVector3(point.latitude, point.longitude, 2.05)
  
  // Animate selected point
  useFrame((state) => {
    if (meshRef.current && isSelected) {
      meshRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 3) * 0.2)
    } else if (meshRef.current) {
      meshRef.current.scale.setScalar(1)
    }
  })
  
  // Color based on severity
  const color = useMemo(() => {
    switch (point.severity) {
      case 'critical': return '#ef4444' // red
      case 'moderate': return '#f97316' // orange
      case 'normal': return '#22c55e' // green
      default: return '#6b7280' // gray
    }
  }, [point.severity])
  
  // Size based on water level (inverted - lower water level = bigger point)
  const size = useMemo(() => {
    const baseSize = 0.02
    const sizeMultiplier = (100 - point.waterLevel) / 100 * 0.03 + 1
    return baseSize * sizeMultiplier
  }, [point.waterLevel])
  
  return (
    <group position={position}>
      {/* Outer ring for concentric effect */}
      <Sphere
        ref={meshRef}
        args={[size * 1.5, 8, 8]}
        onClick={() => onClick(point)}
      >
        <meshBasicMaterial 
          color={color} 
          transparent 
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </Sphere>
      
      {/* Middle ring */}
      <Sphere args={[size * 1.2, 8, 8]} onClick={() => onClick(point)}>
        <meshBasicMaterial 
          color={color} 
          transparent 
          opacity={0.5}
          side={THREE.DoubleSide}
        />
      </Sphere>
      
      {/* Inner core */}
      <Sphere args={[size, 8, 8]} onClick={() => onClick(point)}>
        <meshBasicMaterial 
          color={color} 
          transparent 
          opacity={0.9}
        />
      </Sphere>
      
      {/* Label for selected point */}
      {isSelected && (
        <Text
          position={[0, size * 3, 0]}
          fontSize={0.1}
          color={color}
          anchorX="center"
          anchorY="middle"
        >
          {point.location.split(',')[0]}
        </Text>
      )}
    </group>
  )
}

// Main globe component
export function Globe3D({ data, onPointClick, selectedPoint }: Globe3DProps) {
  const globeRef = useRef<THREE.Mesh>(null)
  
  // Slow rotation
  useFrame(() => {
    if (globeRef.current) {
      globeRef.current.rotation.y += 0.002
    }
  })
  
  // Create earth texture (vintage style)
  const earthTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 1024
    canvas.height = 512
    const ctx = canvas.getContext('2d')!
    
    // Create vintage earth-like texture
    const gradient = ctx.createLinearGradient(0, 0, 0, 512)
    gradient.addColorStop(0, '#4a5568') // Dark blue-gray for poles
    gradient.addColorStop(0.3, '#2d3748') // Darker
    gradient.addColorStop(0.5, '#1a202c') // Darkest at equator
    gradient.addColorStop(0.7, '#2d3748') // Lighter
    gradient.addColorStop(1, '#4a5568') // Light blue-gray
    
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 1024, 512)
    
    // Add some continent-like shapes
    ctx.fillStyle = '#2f855a' // Dark green for land
    ctx.globalAlpha = 0.6
    
    // Simple continent shapes
    for (let i = 0; i < 20; i++) {
      const x = Math.random() * 1024
      const y = Math.random() * 512
      const width = Math.random() * 200 + 50
      const height = Math.random() * 100 + 30
      
      ctx.beginPath()
      ctx.ellipse(x, y, width, height, Math.random() * Math.PI, 0, Math.PI * 2)
      ctx.fill()
    }
    
    return new THREE.CanvasTexture(canvas)
  }, [])
  
  return (
    <group>
      {/* Earth sphere */}
      <Sphere ref={globeRef} args={[2, 64, 64]}>
        <meshLambertMaterial 
          map={earthTexture}
          transparent
          opacity={0.9}
        />
      </Sphere>
      
      {/* Atmosphere glow */}
      <Sphere args={[2.1, 64, 64]}>
        <meshBasicMaterial 
          color="#87ceeb"
          transparent
          opacity={0.1}
          side={THREE.BackSide}
        />
      </Sphere>
      
      {/* Data points */}
      {data.map((point) => (
        <DataPoint
          key={point.id}
          point={point}
          onClick={onPointClick}
          isSelected={selectedPoint?.id === point.id}
        />
      ))}
    </group>
  )
}
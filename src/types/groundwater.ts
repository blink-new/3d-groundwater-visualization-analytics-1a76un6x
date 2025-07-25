export interface GroundwaterData {
  id: string
  latitude: number
  longitude: number
  waterLevel: number // in meters
  qualityIndex: number // 0-100 scale
  severity: 'normal' | 'moderate' | 'critical'
  location: string
  lastUpdated: string
  temperature?: number
  ph?: number
  contaminants?: string[]
}

export interface Globe3DProps {
  data: GroundwaterData[]
  onPointClick: (point: GroundwaterData) => void
  selectedPoint: GroundwaterData | null
}
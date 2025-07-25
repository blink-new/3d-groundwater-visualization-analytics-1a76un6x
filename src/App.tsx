import { useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card'
import { Slider } from './components/ui/slider'
import { Badge } from './components/ui/badge'
import { Button } from './components/ui/button'
import { Globe, Droplets, Filter, BarChart3, Info } from 'lucide-react'
import { Globe3D } from './components/Globe3D'
import { GroundwaterData } from './types/groundwater'
import { generateMockGroundwaterData } from './utils/mockData'

function App() {
  const [groundwaterData, setGroundwaterData] = useState<GroundwaterData[]>([])
  const [filteredData, setFilteredData] = useState<GroundwaterData[]>([])
  const [waterLevelRange, setWaterLevelRange] = useState([0, 100])
  const [selectedPoint, setSelectedPoint] = useState<GroundwaterData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Statistics
  const criticalCount = filteredData.filter(d => d.severity === 'critical').length
  const moderateCount = filteredData.filter(d => d.severity === 'moderate').length
  const normalCount = filteredData.filter(d => d.severity === 'normal').length

  useEffect(() => {
    // Load groundwater data
    const loadData = async () => {
      try {
        setIsLoading(true)
        // Reduced loading time for better UX
        await new Promise(resolve => setTimeout(resolve, 800))
        const data = generateMockGroundwaterData(500)
        setGroundwaterData(data)
        setFilteredData(data)
      } catch (error) {
        console.error('Error loading groundwater data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  useEffect(() => {
    // Filter data based on water level range
    const filtered = groundwaterData.filter(
      d => d.waterLevel >= waterLevelRange[0] && d.waterLevel <= waterLevelRange[1]
    )
    setFilteredData(filtered)
  }, [groundwaterData, waterLevelRange])

  const handlePointClick = (point: GroundwaterData) => {
    setSelectedPoint(point)
  }

  const resetFilters = () => {
    setWaterLevelRange([0, 100])
    setSelectedPoint(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Globe className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-slate-900">
                  Groundwater Analytics Platform
                </h1>
                <p className="text-sm text-slate-600">
                  Interactive 3D visualization of global groundwater data
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-xs">
                <Droplets className="h-3 w-3 mr-1" />
                {filteredData.length} monitoring points
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Controls Panel */}
        <div className="lg:col-span-1 space-y-6">
          {/* Statistics */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Data Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-sm font-medium">Critical</span>
                  </div>
                  <Badge variant="destructive" className="text-xs">
                    {criticalCount}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <span className="text-sm font-medium">Moderate</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {moderateCount}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium">Normal</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {normalCount}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Filters */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <Filter className="h-5 w-5 mr-2" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">
                  Water Level Range (meters)
                </label>
                <div className="px-2">
                  <Slider
                    value={waterLevelRange}
                    onValueChange={setWaterLevelRange}
                    max={100}
                    min={0}
                    step={1}
                    className="w-full"
                  />
                </div>
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>{waterLevelRange[0]}m</span>
                  <span>{waterLevelRange[1]}m</span>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={resetFilters}
                className="w-full"
              >
                Reset Filters
              </Button>
            </CardContent>
          </Card>

          {/* Selected Point Info */}
          {selectedPoint && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <Info className="h-5 w-5 mr-2" />
                  Point Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-slate-700">Location</p>
                  <p className="text-sm text-slate-600">{selectedPoint.location}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700">Water Level</p>
                  <p className="text-sm text-slate-600">{selectedPoint.waterLevel}m</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700">Quality Index</p>
                  <p className="text-sm text-slate-600">{selectedPoint.qualityIndex}/100</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700">Status</p>
                  <Badge 
                    variant={
                      selectedPoint.severity === 'critical' ? 'destructive' :
                      selectedPoint.severity === 'moderate' ? 'secondary' : 'outline'
                    }
                    className="text-xs capitalize"
                  >
                    {selectedPoint.severity}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700">Last Updated</p>
                  <p className="text-sm text-slate-600">
                    {new Date(selectedPoint.lastUpdated).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* 3D Globe */}
        <div className="lg:col-span-3">
          <Card className="h-[600px] lg:h-[700px]">
            <CardContent className="p-0 h-full relative">
              {isLoading ? (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-50 rounded-lg">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-slate-600">Loading groundwater data...</p>
                  </div>
                </div>
              ) : (
                <Canvas
                  camera={{ position: [0, 0, 5], fov: 45 }}
                  className="rounded-lg"
                >
                  <ambientLight intensity={0.4} />
                  <pointLight position={[10, 10, 10]} intensity={0.8} />
                  <Stars radius={300} depth={60} count={1000} factor={7} />
                  
                  <Globe3D 
                    data={filteredData} 
                    onPointClick={handlePointClick}
                    selectedPoint={selectedPoint}
                  />
                  
                  <OrbitControls
                    enablePan={true}
                    enableZoom={true}
                    enableRotate={true}
                    minDistance={3}
                    maxDistance={10}
                    autoRotate={false}
                    autoRotateSpeed={0.5}
                  />
                </Canvas>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default App
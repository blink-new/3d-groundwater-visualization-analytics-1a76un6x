import { GroundwaterData } from '../types/groundwater'

const locations = [
  'California Central Valley, USA',
  'Ganges Basin, India',
  'North China Plain, China',
  'Arabian Peninsula, Saudi Arabia',
  'High Plains Aquifer, USA',
  'Murray-Darling Basin, Australia',
  'Sahara Desert, North Africa',
  'Guarani Aquifer, South America',
  'Great Artesian Basin, Australia',
  'Ogallala Aquifer, USA',
  'Indus Basin, Pakistan',
  'Nile Delta, Egypt',
  'Po Valley, Italy',
  'Central Valley, Mexico',
  'Pannonian Basin, Hungary',
  'Western Cape, South Africa',
  'Punjab Region, India',
  'Mesopotamian Plain, Iraq',
  'Pampas Region, Argentina',
  'Great Hungarian Plain, Hungary'
]

const contaminants = [
  'Nitrates',
  'Pesticides',
  'Heavy Metals',
  'Salinity',
  'Fluoride',
  'Arsenic',
  'Bacteria',
  'Industrial Chemicals'
]

export function generateMockGroundwaterData(count: number): GroundwaterData[] {
  const data: GroundwaterData[] = []
  
  for (let i = 0; i < count; i++) {
    // Generate realistic coordinates with clustering around known groundwater regions
    const lat = (Math.random() - 0.5) * 160 // -80 to 80 degrees
    const lng = (Math.random() - 0.5) * 360 // -180 to 180 degrees
    
    // Generate water level (0-100 meters depth)
    const waterLevel = Math.random() * 100
    
    // Generate quality index (0-100, higher is better)
    const qualityIndex = Math.random() * 100
    
    // Determine severity based on water level and quality
    let severity: 'normal' | 'moderate' | 'critical'
    if (waterLevel < 20 || qualityIndex < 30) {
      severity = 'critical'
    } else if (waterLevel < 50 || qualityIndex < 60) {
      severity = 'moderate'
    } else {
      severity = 'normal'
    }
    
    // Generate random contaminants for problematic wells
    const hasContaminants = severity !== 'normal' && Math.random() > 0.5
    const selectedContaminants = hasContaminants 
      ? contaminants.slice(0, Math.floor(Math.random() * 3) + 1)
      : []
    
    data.push({
      id: `gw-${i.toString().padStart(4, '0')}`,
      latitude: lat,
      longitude: lng,
      waterLevel: Math.round(waterLevel * 10) / 10,
      qualityIndex: Math.round(qualityIndex),
      severity,
      location: locations[Math.floor(Math.random() * locations.length)],
      lastUpdated: new Date(
        Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000 // Last 30 days
      ).toISOString(),
      temperature: Math.round((Math.random() * 30 + 5) * 10) / 10, // 5-35°C
      ph: Math.round((Math.random() * 6 + 4) * 10) / 10, // pH 4-10
      contaminants: selectedContaminants
    })
  }
  
  return data
}
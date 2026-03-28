export interface CropData {
  type: string
  region: string
  landSize: number
  soilType: string
  amount: number
  predictedProfit: number
}

export interface CostData {
  seeds: number
  fertilizer: number
  irrigation: number
  labor: number
  machinery: number
  transport: number
  other: number
}

export interface HarvestData {
  actualYield: number
  actualPrice: number
  actualProfit: number
}

export interface WeatherData {
  temp: number
  humidity: number
  rainfall: number
  condition: string
  location: string
}

export interface Notification {
  id: string
  type: 'irrigation' | 'pest' | 'fertilizer' | 'harvest'
  message: string
  daysUntil: number
  urgency: 'high' | 'medium' | 'low'
}

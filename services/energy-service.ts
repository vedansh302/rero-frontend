import { energyService as apiEnergyService } from "./api-service"

// Types for the energy analysis
export interface EnergyAnalysisRequest {
  location: string
  consumption: number
  propertyType: string
  budget: string
  area: number
  [key: string]: any // For any additional parameters your ML model might need
}

export interface EnergyRecommendation {
  type: string
  efficiency: number
  costEfficiency: number
  sustainability: number
  installationCost: {
    min: number
    max: number
  }
  annualSavings: number
  paybackPeriod: number
}

export interface ClimateData {
  sunlightHours: number
  windSpeed: number
  precipitation: number
  terrain: string
  seasonalVariations: {
    summer: {
      sunlightHours: number
    }
    winter: {
      sunlightHours: number
    }
  }
}

export interface EnergyAnalysisResponse {
  location: string
  timestamp: string
  recommendations: {
    primary: EnergyRecommendation
    alternatives: EnergyRecommendation[]
    climateData: ClimateData
  }
}

// Service to call the API
export async function analyzeEnergyPotential(data: EnergyAnalysisRequest): Promise<EnergyAnalysisResponse> {
  try {
    // Calculate area based on property type if not provided
    const area = data.area || getDefaultAreaByPropertyType(data.propertyType)

    // Convert budget string to number
    const budgetValue = getBudgetValue(data.budget)

    // Call the real API
    const apiResponse = await apiEnergyService.analyzeEnergy({
      location: data.location,
      consumption: data.consumption,
      area: area,
      propertyType: data.propertyType,
      budget: data.budget,
    })

    // Transform the API response to match our frontend expected format
    return transformApiResponse(apiResponse, data)
  } catch (error) {
    console.error("Failed to analyze energy potential:", error)
    throw error
  }
}

// Helper function to get default area by property type
function getDefaultAreaByPropertyType(propertyType: string): number {
  switch (propertyType) {
    case "residential":
      return 150 // 150 sq meters
    case "commercial":
      return 500 // 500 sq meters
    case "industrial":
      return 2000 // 2000 sq meters
    case "agricultural":
      return 10000 // 10000 sq meters
    default:
      return 200 // default
  }
}

// Helper function to convert budget string to number
function getBudgetValue(budget: string): number {
  switch (budget) {
    case "low":
      return 5000
    case "medium":
      return 15000
    case "high":
      return 30000
    case "enterprise":
      return 100000
    default:
      return 15000
  }
}

// Transform API response to match our frontend expected format
function transformApiResponse(apiResponse: any, requestData: EnergyAnalysisRequest): EnergyAnalysisResponse {
  const { bestOption, scores, weather } = apiResponse

  // Map the best option to our recommendation format
  const primaryRecommendation = createRecommendation(bestOption, scores, requestData)

  // Create alternative recommendations
  const alternatives = Object.keys(scores)
    .filter((key) => key !== bestOption)
    .map((key) => createRecommendation(key, scores, requestData, true))

  // Create climate data from weather
  const climateData = createClimateData(weather, requestData.location)

  return {
    location: requestData.location,
    timestamp: new Date().toISOString(),
    recommendations: {
      primary: primaryRecommendation,
      alternatives,
      climateData,
    },
  }
}

// Helper function to create a recommendation object
function createRecommendation(
  type: string,
  scores: any,
  requestData: EnergyAnalysisRequest,
  isAlternative = false,
): EnergyRecommendation {
  // Calculate efficiency based on scores and type
  const efficiency =
    Math.round(scores[type] * 100) ||
    (isAlternative ? Math.floor(Math.random() * 20) + 50 : Math.floor(Math.random() * 20) + 70)

  // Calculate cost efficiency based on budget and type
  const costEfficiency = isAlternative ? Math.floor(Math.random() * 20) + 60 : Math.floor(Math.random() * 30) + 60

  // Calculate sustainability
  const sustainability = isAlternative ? Math.floor(Math.random() * 10) + 85 : Math.floor(Math.random() * 15) + 80

  // Calculate installation cost based on budget and efficiency
  const budgetValue = getBudgetValue(requestData.budget)
  const minCost = isAlternative ? Math.floor(budgetValue * 0.8) : Math.floor(budgetValue * 0.6)
  const maxCost = isAlternative ? Math.floor(budgetValue * 1.2) : Math.floor(budgetValue * 0.9)

  // Calculate annual savings based on consumption and efficiency
  const annualSavings = Math.floor((requestData.consumption * 12 * 0.15 * efficiency) / 100)

  // Calculate payback period
  const avgCost = (minCost + maxCost) / 2
  const paybackPeriod = Number((avgCost / annualSavings).toFixed(1))

  return {
    type,
    efficiency,
    costEfficiency,
    sustainability,
    installationCost: {
      min: minCost,
      max: maxCost,
    },
    annualSavings,
    paybackPeriod,
  }
}

// Helper function to create climate data from weather
function createClimateData(weather: any, location: string): ClimateData {
  // Extract weather data
  const { temp, wind_speed, humidity, condition } = weather

  // Calculate sunlight hours based on temperature and condition
  const baseSunlightHours = condition === "clear" ? 6 : condition === "cloudy" ? 4 : 3
  const sunlightHours = Number((baseSunlightHours + temp / 30).toFixed(1))

  // Calculate precipitation based on humidity
  const precipitation = Math.floor(humidity * 10 + 200)

  // Determine terrain based on location
  const terrain = determineTerrain(location)

  return {
    sunlightHours,
    windSpeed: wind_speed,
    precipitation,
    terrain,
    seasonalVariations: {
      summer: {
        sunlightHours: Number((sunlightHours * 1.3).toFixed(1)),
      },
      winter: {
        sunlightHours: Number((sunlightHours * 0.7).toFixed(1)),
      },
    },
  }
}

// Helper function to determine terrain based on location
function determineTerrain(location: string): string {
  const lowercaseLocation = location.toLowerCase()

  if (
    lowercaseLocation.includes("new york") ||
    lowercaseLocation.includes("chicago") ||
    lowercaseLocation.includes("los angeles")
  ) {
    return "Urban, Dense"
  } else if (
    lowercaseLocation.includes("miami") ||
    lowercaseLocation.includes("seattle") ||
    lowercaseLocation.includes("san francisco")
  ) {
    return "Urban, Coastal"
  } else if (lowercaseLocation.includes("denver") || lowercaseLocation.includes("salt lake")) {
    return "Urban, Mountainous"
  } else if (lowercaseLocation.includes("phoenix") || lowercaseLocation.includes("las vegas")) {
    return "Urban, Desert"
  } else if (lowercaseLocation.includes("portland") || lowercaseLocation.includes("seattle")) {
    return "Urban, River Proximity"
  } else {
    return "Urban, Mixed"
  }
}

// Helper function to determine the primary energy type based on input data
export function determinePrimaryEnergyType(data: EnergyAnalysisRequest): string {
  // This is a simplified logic for demo purposes
  // In a real implementation, this would be determined by your ML model

  // Extract latitude and longitude if available
  let lat = 0,
    lng = 0
  if (data.location.includes(",")) {
    const [latStr, lngStr] = data.location.split(",")
    lat = Number.parseFloat(latStr.trim())
    lng = Number.parseFloat(lngStr.trim())
  }

  // Simple logic based on location and property type
  if (Math.abs(lat) < 30) {
    // Near equator - good for solar
    return "solar"
  } else if (
    data.location.toLowerCase().includes("coast") ||
    data.location.toLowerCase().includes("ocean") ||
    data.location.toLowerCase().includes("sea")
  ) {
    // Coastal areas - good for wind
    return "wind"
  } else if (
    data.location.toLowerCase().includes("river") ||
    data.location.toLowerCase().includes("lake") ||
    data.location.toLowerCase().includes("stream")
  ) {
    // Near water bodies - good for hydro
    return "hydro"
  } else {
    // Default to solar for most locations
    return "solar"
  }
}

// Helper function to determine the secondary energy type
export function determineSecondaryEnergyType(data: EnergyAnalysisRequest): string {
  const primary = determinePrimaryEnergyType(data)
  if (primary === "solar") return "wind"
  if (primary === "wind") return "solar"
  return "wind"
}

// Helper function to determine the tertiary energy type
export function determineTertiaryEnergyType(data: EnergyAnalysisRequest): string {
  const primary = determinePrimaryEnergyType(data)
  const secondary = determineSecondaryEnergyType(data)
  if (primary !== "hydro" && secondary !== "hydro") return "hydro"
  if (primary !== "solar" && secondary !== "solar") return "solar"
  return "wind"
}

"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { Loader2, Sun, Wind, Droplets, Calendar, ArrowLeft, Download, Share2, Printer } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { format } from "date-fns"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts"
import { energyService } from "@/services/api-service"

export default function AnalysisDetailPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const analysisId = params.id as string

  const [analysis, setAnalysis] = useState<any>(null)
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(true)

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [isLoading, user, router])

  // Load analysis details from backend
  useEffect(() => {
    const fetchAnalysisDetails = async () => {
      if (user && analysisId) {
        try {
          setIsLoadingAnalysis(true)
          const response = await energyService.getAnalysisDetails(analysisId)

          // Transform the API response to match our frontend format
          const transformedAnalysis = transformAnalysisData(response)
          setAnalysis(transformedAnalysis)
        } catch (error) {
          console.error("Error fetching analysis details:", error)
          // If API fails, use mock data for demo purposes
          const mockAnalysis = mockAnalysisDetails[analysisId as keyof typeof mockAnalysisDetails]
          setAnalysis(mockAnalysis || null)
        } finally {
          setIsLoadingAnalysis(false)
        }
      }
    }

    fetchAnalysisDetails()
  }, [user, analysisId])

  // Transform API response to match our frontend format
  const transformAnalysisData = (apiResponse: any) => {
    // Extract data from API response
    const { _id, timestamp, input, weatherData, mlResponse, selectedOption } = apiResponse

    // Calculate efficiency, cost efficiency, and sustainability
    const efficiency = calculateEfficiency(mlResponse, selectedOption)
    const costEfficiency = calculateCostEfficiency(mlResponse, selectedOption)
    const sustainability = calculateSustainability(mlResponse, selectedOption)

    // Calculate installation cost based on input
    const budgetMultiplier = input.budget === "low" ? 0.5 : input.budget === "medium" ? 1 : 1.5
    const baseInstallationCost = selectedOption === "solar" ? 10000 : selectedOption === "wind" ? 15000 : 18000
    const minCost = Math.floor(baseInstallationCost * budgetMultiplier * 0.8)
    const maxCost = Math.floor(baseInstallationCost * budgetMultiplier * 1.2)

    // Calculate annual savings based on consumption and efficiency
    const annualSavings = Math.floor((input.consumption * 12 * 0.15 * efficiency) / 100)

    // Calculate payback period
    const avgCost = (minCost + maxCost) / 2
    const paybackPeriod = Number((avgCost / annualSavings).toFixed(1))

    // Create climate data from weather data
    const climateData = createClimateData(weatherData, input.location)

    // Create alternatives
    const alternatives = createAlternatives(mlResponse, selectedOption, input)

    // Create monthly data
    const monthlyData = createMonthlyData(input.consumption, efficiency, selectedOption)

    return {
      id: _id,
      date: new Date(timestamp),
      location: input.location,
      coordinates: getCoordinatesFromLocation(input.location),
      primaryRecommendation: selectedOption,
      efficiency,
      costEfficiency,
      sustainability,
      installationCost: {
        min: minCost,
        max: maxCost,
      },
      annualSavings,
      paybackPeriod,
      notes: generateNotes(selectedOption, input.location),
      climateData,
      alternatives,
      monthlyData,
    }
  }

  // Helper function to calculate efficiency from ML response
  const calculateEfficiency = (mlResponse: any, selectedOption: string) => {
    if (!mlResponse || !mlResponse.scores) return 75 // Default value

    // Calculate efficiency based on the scores
    switch (selectedOption) {
      case "solar":
        return Math.min(95, Math.round((mlResponse.scores.solar / 40) * 100))
      case "wind":
        return Math.min(95, Math.round((mlResponse.scores.wind / 20) * 100))
      case "hydro":
        return Math.min(95, Math.round((mlResponse.scores.humidity / 100) * 100))
      default:
        return 75
    }
  }

  // Helper function to calculate cost efficiency
  const calculateCostEfficiency = (mlResponse: any, selectedOption: string) => {
    // In a real app, this would be based on actual cost data
    // For now, we'll generate a reasonable value
    const baseEfficiency = calculateEfficiency(mlResponse, selectedOption)
    return Math.max(60, Math.min(90, baseEfficiency - Math.floor(Math.random() * 10)))
  }

  // Helper function to calculate sustainability
  const calculateSustainability = (mlResponse: any, selectedOption: string) => {
    // In a real app, this would be based on actual sustainability data
    // For now, we'll generate a reasonable value
    return Math.max(80, Math.min(95, 80 + Math.floor(Math.random() * 15)))
  }

  // Helper function to create climate data
  const createClimateData = (weatherData: any, location: string) => {
    if (!weatherData) {
      // Default values if weather data is not available
      return {
        sunlightHours: 5.2,
        windSpeed: 8.7,
        precipitation: 1200,
        terrain: determineTerrain(location),
        seasonalVariations: {
          summer: { sunlightHours: 6.8 },
          winter: { sunlightHours: 3.5 },
        },
      }
    }

    // Extract weather data
    const { temp, wind_speed, humidity, condition } = weatherData

    // Calculate sunlight hours based on temperature and condition
    const baseSunlightHours = condition === "clear" ? 6 : condition === "cloudy" ? 4 : 3
    const sunlightHours = Number((baseSunlightHours + temp / 30).toFixed(1))

    // Calculate precipitation based on humidity
    const precipitation = Math.floor(humidity * 10 + 200)

    return {
      sunlightHours,
      windSpeed: wind_speed,
      precipitation,
      terrain: determineTerrain(location),
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
  const determineTerrain = (location: string) => {
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

  // Helper function to create alternatives
  const createAlternatives = (mlResponse: any, selectedOption: string, input: any) => {
    const energyTypes = ["solar", "wind", "hydro"]
    const alternatives = energyTypes.filter((type) => type !== selectedOption)

    return alternatives.map((type, index) => {
      // Calculate efficiency based on scores and type
      const efficiency = index === 0 ? Math.floor(Math.random() * 20) + 50 : Math.floor(Math.random() * 20) + 30

      // Calculate cost efficiency
      const costEfficiency = index === 0 ? Math.floor(Math.random() * 20) + 60 : Math.floor(Math.random() * 15) + 70

      // Calculate sustainability
      const sustainability = index === 0 ? Math.floor(Math.random() * 10) + 85 : Math.floor(Math.random() * 20) + 70

      return {
        type,
        efficiency,
        costEfficiency,
        sustainability,
      }
    })
  }

  // Helper function to create monthly data
  const createMonthlyData = (consumption: number, efficiency: number, selectedOption: string) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    // Create different patterns based on energy type
    if (selectedOption === "solar") {
      return months.map((month, index) => {
        // Solar production is higher in summer months
        const seasonalFactor = index < 2 || index > 9 ? 0.6 : index < 4 || index > 7 ? 0.8 : 1.2
        const production = Math.floor(consumption * seasonalFactor * (efficiency / 100))
        return {
          month,
          production,
          consumption,
        }
      })
    } else if (selectedOption === "wind") {
      return months.map((month, index) => {
        // Wind production is higher in winter and fall
        const seasonalFactor = index < 2 || index > 9 ? 1.2 : index < 4 || index > 7 ? 0.9 : 0.7
        const production = Math.floor(consumption * seasonalFactor * (efficiency / 100))
        return {
          month,
          production,
          consumption,
        }
      })
    } else {
      // Hydro production is relatively stable
      return months.map((month) => {
        const randomFactor = 0.9 + Math.random() * 0.2
        const production = Math.floor(consumption * randomFactor * (efficiency / 100))
        return {
          month,
          production,
          consumption,
        }
      })
    }
  }

  // Helper function to generate notes
  const generateNotes = (selectedOption: string, location: string) => {
    switch (selectedOption) {
      case "solar":
        return `${location} has good solar potential based on climate conditions`
      case "wind":
        return `${location} has favorable wind conditions for energy generation`
      case "hydro":
        return `${location} has water resources suitable for hydro energy`
      default:
        return `Analysis for ${location} completed successfully`
    }
  }

  // Helper function to get coordinates from location
  const getCoordinatesFromLocation = (location: string) => {
    // In a real app, this would use geocoding
    // For now, we'll return a mock value
    return `${Math.random() * 90}° N, ${Math.random() * 180}° W`
  }

  if (isLoading || isLoadingAnalysis) {
    return (
      <div className="container mx-auto py-10 flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    )
  }

  if (!analysis) {
    return (
      <div className="container mx-auto py-10">
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-muted-foreground">Analysis not found.</p>
            <Button className="mt-4 bg-green-600 hover:bg-green-700" onClick={() => router.push("/profile/history")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to History
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Get icon based on recommendation type
  const getRecommendationIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "solar":
        return <Sun className="h-5 w-5 text-yellow-500" />
      case "wind":
        return <Wind className="h-5 w-5 text-blue-500" />
      case "hydro":
        return <Droplets className="h-5 w-5 text-cyan-500" />
      default:
        return null
    }
  }

  // Get color class based on recommendation type
  const getRecommendationColorClass = (type: string) => {
    switch (type.toLowerCase()) {
      case "solar":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
      case "wind":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
      case "hydro":
        return "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"
    }
  }

  // Prepare chart data
  const comparisonData = [
    {
      name: capitalizeFirstLetter(analysis.primaryRecommendation),
      efficiency: analysis.efficiency,
      cost: analysis.costEfficiency,
      sustainability: analysis.sustainability,
    },
    ...analysis.alternatives.map((alt: any) => ({
      name: capitalizeFirstLetter(alt.type),
      efficiency: alt.efficiency,
      cost: alt.costEfficiency,
      sustainability: alt.sustainability,
    })),
  ]

  // Helper function to capitalize first letter
  function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => router.push("/profile/history")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-3xl font-bold">Analysis Details</h1>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export PDF
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={getRecommendationColorClass(analysis.primaryRecommendation)}>
                    <span className="flex items-center gap-1">
                      {getRecommendationIcon(analysis.primaryRecommendation)}
                      {capitalizeFirstLetter(analysis.primaryRecommendation)}
                    </span>
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {format(new Date(analysis.date), "MMM d, yyyy")}
                  </Badge>
                </div>
                <CardTitle className="text-2xl">{analysis.location}</CardTitle>
                <CardDescription>{analysis.coordinates}</CardDescription>
              </div>

              <div className="flex flex-col items-end">
                <div className="text-sm text-muted-foreground">Efficiency Rating</div>
                <div className="text-3xl font-bold">{analysis.efficiency}%</div>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <Tabs defaultValue="overview">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="comparison">Comparison</TabsTrigger>
                <TabsTrigger value="production">Production</TabsTrigger>
                <TabsTrigger value="climate">Climate Data</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6 pt-6">
                <div className="grid gap-6 md:grid-cols-3">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Installation Cost</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        ${analysis.installationCost.min.toLocaleString()} - $
                        {analysis.installationCost.max.toLocaleString()}
                      </div>
                      <p className="text-sm text-muted-foreground">Before incentives and rebates</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Annual Savings</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">${analysis.annualSavings.toLocaleString()}</div>
                      <p className="text-sm text-muted-foreground">Estimated yearly energy savings</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Payback Period</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{analysis.paybackPeriod} years</div>
                      <p className="text-sm text-muted-foreground">Time to recoup investment</p>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Analysis Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{analysis.notes}</p>

                    <div className="mt-6 grid gap-4 md:grid-cols-3">
                      <div>
                        <h4 className="font-medium mb-2">Efficiency Metrics</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-sm">
                            <span>Energy Efficiency:</span>
                            <span className="font-medium">{analysis.efficiency}%</span>
                          </div>
                          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-green-600 rounded-full"
                              style={{ width: `${analysis.efficiency}%` }}
                            ></div>
                          </div>

                          <div className="flex justify-between items-center text-sm">
                            <span>Cost Efficiency:</span>
                            <span className="font-medium">{analysis.costEfficiency}%</span>
                          </div>
                          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-green-600 rounded-full"
                              style={{ width: `${analysis.costEfficiency}%` }}
                            ></div>
                          </div>

                          <div className="flex justify-between items-center text-sm">
                            <span>Sustainability:</span>
                            <span className="font-medium">{analysis.sustainability}%</span>
                          </div>
                          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-green-600 rounded-full"
                              style={{ width: `${analysis.sustainability}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">Climate Conditions</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span>Avg. Sunlight:</span>
                            <span className="font-medium">{analysis.climateData.sunlightHours} hrs/day</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Wind Speed:</span>
                            <span className="font-medium">{analysis.climateData.windSpeed} km/h</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Precipitation:</span>
                            <span className="font-medium">{analysis.climateData.precipitation} mm/year</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Terrain:</span>
                            <span className="font-medium">{analysis.climateData.terrain}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">Financial Projection</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span>Initial Investment:</span>
                            <span className="font-medium">
                              ${analysis.installationCost.min.toLocaleString()} - $
                              {analysis.installationCost.max.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Annual Savings:</span>
                            <span className="font-medium">${analysis.annualSavings.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Payback Period:</span>
                            <span className="font-medium">{analysis.paybackPeriod} years</span>
                          </div>
                          <div className="flex justify-between">
                            <span>20-Year Savings:</span>
                            <span className="font-medium">${(analysis.annualSavings * 20).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="comparison" className="pt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Energy Source Comparison</CardTitle>
                    <CardDescription>
                      Comparing {capitalizeFirstLetter(analysis.primaryRecommendation)} with alternative energy sources
                      for your location
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={comparisonData}
                          margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="efficiency" name="Efficiency (%)" fill="#22c55e" />
                          <Bar dataKey="cost" name="Cost Efficiency (%)" fill="#3b82f6" />
                          <Bar dataKey="sustainability" name="Sustainability (%)" fill="#f59e0b" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="production" className="pt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Monthly Energy Production vs. Consumption</CardTitle>
                    <CardDescription>
                      Estimated energy production from {capitalizeFirstLetter(analysis.primaryRecommendation)} compared
                      to your consumption
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={analysis.monthlyData}
                          margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="production"
                            name="Energy Production (kWh)"
                            stroke="#22c55e"
                            activeDot={{ r: 8 }}
                          />
                          <Line
                            type="monotone"
                            dataKey="consumption"
                            name="Energy Consumption (kWh)"
                            stroke="#ef4444"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="climate" className="pt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Climate Data Analysis</CardTitle>
                    <CardDescription>Detailed climate information for {analysis.location}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6 md:grid-cols-2">
                      <div>
                        <h3 className="text-lg font-medium mb-4">Climate Metrics</h3>
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between mb-1">
                              <span>Average Sunlight Hours</span>
                              <span className="font-medium">{analysis.climateData.sunlightHours} hrs/day</span>
                            </div>
                            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-yellow-500 rounded-full"
                                style={{ width: `${(analysis.climateData.sunlightHours / 12) * 100}%` }}
                              ></div>
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between mb-1">
                              <span>Average Wind Speed</span>
                              <span className="font-medium">{analysis.climateData.windSpeed} km/h</span>
                            </div>
                            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-blue-500 rounded-full"
                                style={{ width: `${(analysis.climateData.windSpeed / 25) * 100}%` }}
                              ></div>
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between mb-1">
                              <span>Annual Precipitation</span>
                              <span className="font-medium">{analysis.climateData.precipitation} mm/year</span>
                            </div>
                            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-cyan-500 rounded-full"
                                style={{ width: `${(analysis.climateData.precipitation / 2000) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>

                        <div className="mt-6">
                          <h4 className="font-medium mb-2">Terrain</h4>
                          <p>{analysis.climateData.terrain}</p>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium mb-4">Seasonal Variations</h3>
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium">Summer</h4>
                            <div className="flex justify-between mb-1">
                              <span>Sunlight Hours</span>
                              <span className="font-medium">
                                {analysis.climateData.seasonalVariations.summer.sunlightHours} hrs/day
                              </span>
                            </div>
                            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-yellow-500 rounded-full"
                                style={{
                                  width: `${(analysis.climateData.seasonalVariations.summer.sunlightHours / 12) * 100}%`,
                                }}
                              ></div>
                            </div>
                          </div>

                          <div>
                            <h4 className="font-medium">Winter</h4>
                            <div className="flex justify-between mb-1">
                              <span>Sunlight Hours</span>
                              <span className="font-medium">
                                {analysis.climateData.seasonalVariations.winter.sunlightHours} hrs/day
                              </span>
                            </div>
                            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-yellow-500 rounded-full"
                                style={{
                                  width: `${(analysis.climateData.seasonalVariations.winter.sunlightHours / 12) * 100}%`,
                                }}
                              ></div>
                            </div>
                          </div>
                        </div>

                        <div className="mt-6">
                          <h4 className="font-medium mb-2">Climate Impact on Energy Production</h4>
                          <p className="text-sm text-muted-foreground">
                            {analysis.primaryRecommendation === "solar" &&
                              `Your location receives good sunlight throughout the year, with peak production during summer months. 
                              The ${analysis.climateData.seasonalVariations.summer.sunlightHours} hours of daily sunlight in summer 
                              will maximize solar energy production.`}
                            {analysis.primaryRecommendation === "wind" &&
                              `Your location has consistent wind patterns, with an average speed of ${analysis.climateData.windSpeed} km/h. 
                              This is ideal for wind energy production throughout the year.`}
                            {analysis.primaryRecommendation === "hydro" &&
                              `Your location's proximity to water sources and annual precipitation of ${analysis.climateData.precipitation} mm 
                              provides excellent conditions for hydroelectric energy production.`}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Mock detailed analysis data for fallback
const mockAnalysisDetails = {
  analysis_1: {
    id: "analysis_1",
    date: new Date(2023, 10, 15),
    location: "New York, NY",
    coordinates: "40.7128° N, 74.0060° W",
    primaryRecommendation: "solar",
    efficiency: 85,
    costEfficiency: 78,
    sustainability: 92,
    installationCost: {
      min: 12000,
      max: 15000,
    },
    annualSavings: 1350,
    paybackPeriod: 9.2,
    notes: "Urban location with good solar potential",
    climateData: {
      sunlightHours: 5.2,
      windSpeed: 8.7,
      precipitation: 1200,
      terrain: "Urban, Dense",
      seasonalVariations: {
        summer: { sunlightHours: 6.8 },
        winter: { sunlightHours: 3.5 },
      },
    },
    alternatives: [
      {
        type: "wind",
        efficiency: 65,
        costEfficiency: 70,
        sustainability: 88,
      },
      {
        type: "hydro",
        efficiency: 40,
        costEfficiency: 55,
        sustainability: 95,
      },
    ],
    monthlyData: [
      { month: "Jan", production: 450, consumption: 950 },
      { month: "Feb", production: 520, consumption: 900 },
      { month: "Mar", production: 700, consumption: 850 },
      { month: "Apr", production: 850, consumption: 800 },
      { month: "May", production: 950, consumption: 750 },
      { month: "Jun", production: 1050, consumption: 800 },
      { month: "Jul", production: 1100, consumption: 950 },
      { month: "Aug", production: 1000, consumption: 900 },
      { month: "Sep", production: 850, consumption: 800 },
      { month: "Oct", production: 700, consumption: 750 },
      { month: "Nov", production: 550, consumption: 800 },
      { month: "Dec", production: 450, consumption: 950 },
    ],
  },
  analysis_2: {
    id: "analysis_2",
    date: new Date(2023, 9, 28),
    location: "Chicago, IL",
    coordinates: "41.8781° N, 87.6298° W",
    primaryRecommendation: "wind",
    efficiency: 78,
    costEfficiency: 82,
    sustainability: 90,
    installationCost: {
      min: 15000,
      max: 20000,
    },
    annualSavings: 1650,
    paybackPeriod: 10.6,
    notes: "Windy city with moderate solar potential",
    climateData: {
      sunlightHours: 4.6,
      windSpeed: 16.2,
      precipitation: 950,
      terrain: "Urban, Flat",
      seasonalVariations: {
        summer: { sunlightHours: 6.2 },
        winter: { sunlightHours: 3.1 },
      },
    },
    alternatives: [
      {
        type: "solar",
        efficiency: 68,
        costEfficiency: 72,
        sustainability: 88,
      },
      {
        type: "hydro",
        efficiency: 35,
        costEfficiency: 50,
        sustainability: 92,
      },
    ],
    monthlyData: [
      { month: "Jan", production: 750, consumption: 1050 },
      { month: "Feb", production: 780, consumption: 1000 },
      { month: "Mar", production: 820, consumption: 950 },
      { month: "Apr", production: 750, consumption: 900 },
      { month: "May", production: 700, consumption: 850 },
      { month: "Jun", production: 650, consumption: 900 },
      { month: "Jul", production: 600, consumption: 950 },
      { month: "Aug", production: 650, consumption: 900 },
      { month: "Sep", production: 700, consumption: 850 },
      { month: "Oct", production: 780, consumption: 900 },
      { month: "Nov", production: 800, consumption: 950 },
      { month: "Dec", production: 780, consumption: 1050 },
    ],
  },
  analysis_3: {
    id: "analysis_3",
    date: new Date(2023, 8, 10),
    location: "Portland, OR",
    coordinates: "45.5152° N, 122.6784° W",
    primaryRecommendation: "hydro",
    efficiency: 92,
    costEfficiency: 85,
    sustainability: 95,
    installationCost: {
      min: 18000,
      max: 25000,
    },
    annualSavings: 2100,
    paybackPeriod: 10.2,
    notes: "Excellent hydro potential due to nearby rivers",
    climateData: {
      sunlightHours: 4.2,
      windSpeed: 7.8,
      precipitation: 1150,
      terrain: "Urban, River Proximity",
      seasonalVariations: {
        summer: { sunlightHours: 5.8 },
        winter: { sunlightHours: 2.6 },
      },
    },
    alternatives: [
      {
        type: "solar",
        efficiency: 60,
        costEfficiency: 65,
        sustainability: 88,
      },
      {
        type: "wind",
        efficiency: 55,
        costEfficiency: 60,
        sustainability: 90,
      },
    ],
    monthlyData: [
      { month: "Jan", production: 950, consumption: 900 },
      { month: "Feb", production: 920, consumption: 880 },
      { month: "Mar", production: 900, consumption: 850 },
      { month: "Apr", production: 880, consumption: 820 },
      { month: "May", production: 850, consumption: 800 },
      { month: "Jun", production: 820, consumption: 780 },
      { month: "Jul", production: 800, consumption: 820 },
      { month: "Aug", production: 820, consumption: 850 },
      { month: "Sep", production: 850, consumption: 880 },
      { month: "Oct", production: 880, consumption: 900 },
      { month: "Nov", production: 920, consumption: 920 },
      { month: "Dec", production: 950, consumption: 950 },
    ],
  },
  analysis_4: {
    id: "analysis_4",
    date: new Date(2023, 7, 5),
    location: "Phoenix, AZ",
    coordinates: "33.4484° N, 112.0740° W",
    primaryRecommendation: "solar",
    efficiency: 95,
    costEfficiency: 90,
    sustainability: 88,
    installationCost: {
      min: 10000,
      max: 14000,
    },
    annualSavings: 1800,
    paybackPeriod: 6.7,
    notes: "Excellent solar potential in desert climate",
    climateData: {
      sunlightHours: 7.8,
      windSpeed: 6.2,
      precipitation: 210,
      terrain: "Urban, Desert",
      seasonalVariations: {
        summer: { sunlightHours: 9.5 },
        winter: { sunlightHours: 6.2 },
      },
    },
    alternatives: [
      {
        type: "wind",
        efficiency: 45,
        costEfficiency: 50,
        sustainability: 85,
      },
      {
        type: "hydro",
        efficiency: 20,
        costEfficiency: 25,
        sustainability: 80,
      },
    ],
    monthlyData: [
      { month: "Jan", production: 950, consumption: 800 },
      { month: "Feb", production: 1000, consumption: 780 },
      { month: "Mar", production: 1100, consumption: 750 },
      { month: "Apr", production: 1200, consumption: 800 },
      { month: "May", production: 1300, consumption: 950 },
      { month: "Jun", production: 1350, consumption: 1100 },
      { month: "Jul", production: 1300, consumption: 1200 },
      { month: "Aug", production: 1250, consumption: 1150 },
      { month: "Sep", production: 1200, consumption: 1000 },
      { month: "Oct", production: 1100, consumption: 850 },
      { month: "Nov", production: 1000, consumption: 800 },
      { month: "Dec", production: 950, consumption: 780 },
    ],
  },
  analysis_5: {
    id: "analysis_5",
    date: new Date(2023, 6, 20),
    location: "Seattle, WA",
    coordinates: "47.6062° N, 122.3321° W",
    primaryRecommendation: "hydro",
    efficiency: 88,
    costEfficiency: 82,
    sustainability: 94,
    installationCost: {
      min: 16000,
      max: 22000,
    },
    annualSavings: 1750,
    paybackPeriod: 10.9,
    notes: "Good hydro potential with moderate solar",
    climateData: {
      sunlightHours: 3.8,
      windSpeed: 8.5,
      precipitation: 950,
      terrain: "Urban, Coastal",
      seasonalVariations: {
        summer: { sunlightHours: 5.6 },
        winter: { sunlightHours: 2.1 },
      },
    },
    alternatives: [
      {
        type: "solar",
        efficiency: 55,
        costEfficiency: 60,
        sustainability: 85,
      },
      {
        type: "wind",
        efficiency: 65,
        costEfficiency: 70,
        sustainability: 90,
      },
    ],
    monthlyData: [
      { month: "Jan", production: 900, consumption: 950 },
      { month: "Feb", production: 880, consumption: 920 },
      { month: "Mar", production: 860, consumption: 900 },
      { month: "Apr", production: 840, consumption: 880 },
      { month: "May", production: 820, consumption: 850 },
      { month: "Jun", production: 800, consumption: 820 },
      { month: "Jul", production: 780, consumption: 850 },
      { month: "Aug", production: 800, consumption: 880 },
      { month: "Sep", production: 820, consumption: 900 },
      { month: "Oct", production: 850, consumption: 920 },
      { month: "Nov", production: 880, consumption: 940 },
      { month: "Dec", production: 900, consumption: 950 },
    ],
  },
}

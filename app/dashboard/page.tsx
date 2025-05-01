"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { MapPin, Sun, Wind, Droplets, Info, Loader2, AlertCircle } from "lucide-react"
import { analyzeEnergyPotential, type EnergyAnalysisResponse } from "@/services/energy-service"
import { useToast } from "@/hooks/use-toast"
import { MLInsights } from "@/components/ml-insights"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/contexts/auth-context"

export default function Dashboard() {
  const [location, setLocation] = useState("")
  const [consumption, setConsumption] = useState<number[]>([1500])
  const [propertyType, setPropertyType] = useState("residential")
  const [budget, setBudget] = useState("medium")
  const [area, setArea] = useState<number[]>([200])
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("analyze")
  const [analysisResult, setAnalysisResult] = useState<EnergyAnalysisResponse | null>(null)
  const [analysisError, setAnalysisError] = useState<string | null>(null)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const { toast } = useToast()
  const { user } = useAuth()

  // Simulate analysis progress
  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setAnalysisProgress((prev) => {
          const newProgress = prev + Math.random() * 15
          return newProgress >= 100 ? 100 : newProgress
        })
      }, 500)

      return () => {
        clearInterval(interval)
        setAnalysisProgress(0)
      }
    }
  }, [isLoading])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setAnalysisError(null)
    setAnalysisProgress(0)

    try {
      const result = await analyzeEnergyPotential({
        location,
        consumption: consumption[0],
        propertyType,
        budget,
        area: area[0],
      })

      setAnalysisResult(result)
      setActiveTab("results")

      toast({
        title: "Analysis Complete",
        description: "Your renewable energy analysis is ready to view.",
      })
    } catch (error: any) {
      console.error("Error analyzing energy potential:", error)
      const errorMessage =
        error.response?.data?.message || "There was an error analyzing your energy potential. Please try again."
      setAnalysisError(errorMessage)
      toast({
        title: "Analysis Failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Function to prepare chart data from the ML model response
  const prepareChartData = () => {
    if (!analysisResult) return []

    const { primary, alternatives } = analysisResult.recommendations

    return [
      {
        name: capitalizeFirstLetter(primary.type),
        efficiency: primary.efficiency,
        cost: primary.costEfficiency,
        sustainability: primary.sustainability,
        fill: getColorForEnergyType(primary.type),
      },
      ...alternatives.map((alt) => ({
        name: capitalizeFirstLetter(alt.type),
        efficiency: alt.efficiency,
        cost: alt.costEfficiency,
        sustainability: alt.sustainability,
        fill: getColorForEnergyType(alt.type),
      })),
    ]
  }

  // Helper function to capitalize the first letter
  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }

  // Helper function to get color based on energy type
  const getColorForEnergyType = (type: string) => {
    switch (type.toLowerCase()) {
      case "solar":
        return "hsl(48, 100%, 50%)"
      case "wind":
        return "hsl(211, 100%, 50%)"
      case "hydro":
        return "hsl(187, 100%, 50%)"
      default:
        return "hsl(200, 100%, 50%)"
    }
  }

  // Helper function to get background color class based on energy type
  const getBgColorClass = (type: string) => {
    switch (type.toLowerCase()) {
      case "solar":
        return "bg-yellow-50 dark:bg-yellow-900/20"
      case "wind":
        return "bg-blue-50 dark:bg-blue-900/20"
      case "hydro":
        return "bg-cyan-50 dark:bg-cyan-900/20"
      default:
        return "bg-gray-50 dark:bg-gray-900/20"
    }
  }

  // Helper function to get text color class based on energy type
  const getTextColorClass = (type: string) => {
    switch (type.toLowerCase()) {
      case "solar":
        return "text-yellow-600"
      case "wind":
        return "text-blue-600"
      case "hydro":
        return "text-cyan-600"
      default:
        return "text-gray-600"
    }
  }

  // Helper function to get button color class based on energy type
  const getButtonColorClass = (type: string) => {
    switch (type.toLowerCase()) {
      case "solar":
        return "bg-yellow-600 hover:bg-yellow-700"
      case "wind":
        return "bg-blue-600 hover:bg-blue-700"
      case "hydro":
        return "bg-cyan-600 hover:bg-cyan-700"
      default:
        return "bg-green-600 hover:bg-green-700"
    }
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Energy Resource Dashboard</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="analyze">Analyze Location</TabsTrigger>
          <TabsTrigger value="results" disabled={!analysisResult}>
            Results
          </TabsTrigger>
          <TabsTrigger value="recommendations" disabled={!analysisResult}>
            Recommendations
          </TabsTrigger>
        </TabsList>

        <TabsContent value="analyze">
          <Card>
            <CardHeader>
              <CardTitle>Location Analysis</CardTitle>
              <CardDescription>
                Enter your location and energy consumption details to get personalized renewable energy recommendations.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="location">Your Location</Label>
                  <div className="flex gap-2">
                    <Input
                      id="location"
                      placeholder="Enter your address or coordinates"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      required
                      className="flex-1"
                      disabled={isLoading}
                    />
                    <Button
                      variant="outline"
                      type="button"
                      className="shrink-0"
                      disabled={isLoading}
                      onClick={() => {
                        // Get user's current location
                        if (navigator.geolocation) {
                          navigator.geolocation.getCurrentPosition(
                            (position) => {
                              const { latitude, longitude } = position.coords
                              setLocation(`${latitude}, ${longitude}`)
                              toast({
                                title: "Location Updated",
                                description: "Using your current coordinates for analysis.",
                              })
                            },
                            (error) => {
                              console.error("Error getting location:", error)
                              toast({
                                title: "Location Error",
                                description: "Could not get your current location. Please enter it manually.",
                                variant: "destructive",
                              })
                            },
                          )
                        }
                      }}
                    >
                      <MapPin className="h-4 w-4 mr-2" />
                      Use Current
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="property-type">Property Type</Label>
                  <Select value={propertyType} onValueChange={setPropertyType} disabled={isLoading}>
                    <SelectTrigger id="property-type">
                      <SelectValue placeholder="Select property type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="residential">Residential</SelectItem>
                      <SelectItem value="commercial">Commercial</SelectItem>
                      <SelectItem value="industrial">Industrial</SelectItem>
                      <SelectItem value="agricultural">Agricultural</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="energy-consumption">Monthly Energy Consumption (kWh)</Label>
                    <span className="text-sm text-muted-foreground">{consumption[0]} kWh</span>
                  </div>
                  <Slider
                    id="energy-consumption"
                    min={100}
                    max={5000}
                    step={100}
                    value={consumption}
                    onValueChange={setConsumption}
                    disabled={isLoading}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>100 kWh</span>
                    <span>5000 kWh</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="property-area">Property Area (sq meters)</Label>
                    <span className="text-sm text-muted-foreground">{area[0]} m²</span>
                  </div>
                  <Slider
                    id="property-area"
                    min={50}
                    max={2000}
                    step={50}
                    value={area}
                    onValueChange={setArea}
                    disabled={isLoading}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>50 m²</span>
                    <span>2000 m²</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="budget">Budget Range</Label>
                  <Select value={budget} onValueChange={setBudget} disabled={isLoading}>
                    <SelectTrigger id="budget">
                      <SelectValue placeholder="Select your budget range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low ($1,000 - $5,000)</SelectItem>
                      <SelectItem value="medium">Medium ($5,000 - $15,000)</SelectItem>
                      <SelectItem value="high">High ($15,000 - $30,000)</SelectItem>
                      <SelectItem value="enterprise">Enterprise ($30,000+)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {analysisError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{analysisError}</AlertDescription>
                  </Alert>
                )}

                {isLoading && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Analyzing your location...</span>
                      <span>{Math.round(analysisProgress)}%</span>
                    </div>
                    <Progress value={analysisProgress} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                      Our ML model is analyzing climate data, terrain information, and energy requirements for your
                      location.
                    </p>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    "Analyze Location"
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="results">
          {analysisResult ? (
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Energy Potential Analysis</CardTitle>
                  <CardDescription>
                    Based on your location at {analysisResult.location || "the provided address"}, here's the renewable
                    energy potential.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={prepareChartData()}
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
                        <Bar dataKey="efficiency" name="Efficiency (%)" fill="var(--primary)" />
                        <Bar dataKey="cost" name="Cost Efficiency (%)" fill="var(--secondary)" />
                        <Bar dataKey="sustainability" name="Sustainability (%)" fill="var(--accent)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={() => setActiveTab("recommendations")}>
                    View Detailed Recommendations
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Climate Conditions</CardTitle>
                  <CardDescription>Current and historical climate data for your location.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {analysisResult.recommendations.climateData && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="text-sm font-medium text-muted-foreground">Average Sunlight</div>
                          <div className="flex items-center">
                            <Sun className="h-5 w-5 mr-2 text-yellow-500" />
                            <span className="text-2xl font-bold">
                              {analysisResult.recommendations.climateData.sunlightHours}
                            </span>
                            <span className="text-sm ml-1">hours/day</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="text-sm font-medium text-muted-foreground">Wind Speed</div>
                          <div className="flex items-center">
                            <Wind className="h-5 w-5 mr-2 text-blue-500" />
                            <span className="text-2xl font-bold">
                              {analysisResult.recommendations.climateData.windSpeed}
                            </span>
                            <span className="text-sm ml-1">km/h</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="text-sm font-medium text-muted-foreground">Precipitation</div>
                          <div className="flex items-center">
                            <Droplets className="h-5 w-5 mr-2 text-cyan-500" />
                            <span className="text-2xl font-bold">
                              {analysisResult.recommendations.climateData.precipitation}
                            </span>
                            <span className="text-sm ml-1">mm/year</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="text-sm font-medium text-muted-foreground">Terrain</div>
                          <div className="flex items-center">
                            <span className="text-lg font-medium">
                              {analysisResult.recommendations.climateData.terrain}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 border-t">
                        <h4 className="font-medium mb-2">Seasonal Variations</h4>
                        <p className="text-sm text-muted-foreground">
                          Your location experiences moderate seasonal changes with peak sunlight hours in summer (
                          {analysisResult.recommendations.climateData.seasonalVariations.summer.sunlightHours} hrs/day)
                          and reduced sunlight in winter (
                          {analysisResult.recommendations.climateData.seasonalVariations.winter.sunlightHours} hrs/day).
                          Wind patterns are consistent throughout the year.
                        </p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="py-10 text-center">
                <p>No analysis data available. Please complete the analysis form first.</p>
                <Button onClick={() => setActiveTab("analyze")} className="mt-4 bg-green-600 hover:bg-green-700">
                  Go to Analysis Form
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="recommendations">
          {analysisResult ? (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    {analysisResult.recommendations.primary.type === "solar" && (
                      <Sun className="h-6 w-6 mr-2 text-yellow-500" />
                    )}
                    {analysisResult.recommendations.primary.type === "wind" && (
                      <Wind className="h-6 w-6 mr-2 text-blue-500" />
                    )}
                    {analysisResult.recommendations.primary.type === "hydro" && (
                      <Droplets className="h-6 w-6 mr-2 text-cyan-500" />
                    )}
                    Primary Recommendation: {capitalizeFirstLetter(analysisResult.recommendations.primary.type)} Energy
                  </CardTitle>
                  <CardDescription>
                    Based on your location, climate conditions, and energy consumption,{" "}
                    {analysisResult.recommendations.primary.type} energy is the optimal choice.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className={getBgColorClass(analysisResult.recommendations.primary.type) + " p-4 rounded-lg"}>
                      <h4 className="font-medium mb-2">Efficiency Rating</h4>
                      <div
                        className={
                          getTextColorClass(analysisResult.recommendations.primary.type) + " text-3xl font-bold"
                        }
                      >
                        {analysisResult.recommendations.primary.efficiency}%
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        High {analysisResult.recommendations.primary.type} potential based on your location's conditions
                      </p>
                    </div>
                    <div className={getBgColorClass(analysisResult.recommendations.primary.type) + " p-4 rounded-lg"}>
                      <h4 className="font-medium mb-2">Cost Efficiency</h4>
                      <div
                        className={
                          getTextColorClass(analysisResult.recommendations.primary.type) + " text-3xl font-bold"
                        }
                      >
                        {analysisResult.recommendations.primary.costEfficiency}%
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Good return on investment with current incentives
                      </p>
                    </div>
                    <div className={getBgColorClass(analysisResult.recommendations.primary.type) + " p-4 rounded-lg"}>
                      <h4 className="font-medium mb-2">Sustainability</h4>
                      <div
                        className={
                          getTextColorClass(analysisResult.recommendations.primary.type) + " text-3xl font-bold"
                        }
                      >
                        {analysisResult.recommendations.primary.sustainability}%
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Excellent environmental impact with minimal carbon footprint
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-2">Implementation Recommendations</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start">
                        <Info
                          className={`h-4 w-4 mr-2 mt-0.5 ${getTextColorClass(analysisResult.recommendations.primary.type)}`}
                        />
                        <span>
                          {analysisResult.recommendations.primary.type === "solar" &&
                            `Install a 5kW rooftop solar panel system to cover your energy consumption of ${consumption[0]} kWh/month`}
                          {analysisResult.recommendations.primary.type === "wind" &&
                            `Install a small wind turbine system to cover your energy consumption of ${consumption[0]} kWh/month`}
                          {analysisResult.recommendations.primary.type === "hydro" &&
                            `Install a micro-hydro system to cover your energy consumption of ${consumption[0]} kWh/month`}
                        </span>
                      </li>
                      <li className="flex items-start">
                        <Info
                          className={`h-4 w-4 mr-2 mt-0.5 ${getTextColorClass(analysisResult.recommendations.primary.type)}`}
                        />
                        <span>
                          {analysisResult.recommendations.primary.type === "solar" &&
                            "Consider south-facing panel orientation for optimal sunlight exposure"}
                          {analysisResult.recommendations.primary.type === "wind" &&
                            "Consider installing at a height of at least 30 feet for optimal wind exposure"}
                          {analysisResult.recommendations.primary.type === "hydro" &&
                            "Consider water flow and head height for optimal system placement"}
                        </span>
                      </li>
                      <li className="flex items-start">
                        <Info
                          className={`h-4 w-4 mr-2 mt-0.5 ${getTextColorClass(analysisResult.recommendations.primary.type)}`}
                        />
                        <span>
                          Estimated installation cost: $
                          {analysisResult.recommendations.primary.installationCost.min.toLocaleString()} - $
                          {analysisResult.recommendations.primary.installationCost.max.toLocaleString()} (before
                          incentives)
                        </span>
                      </li>
                      <li className="flex items-start">
                        <Info
                          className={`h-4 w-4 mr-2 mt-0.5 ${getTextColorClass(analysisResult.recommendations.primary.type)}`}
                        />
                        <span>Available tax credits and incentives can reduce costs by up to 30%</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className={`w-full ${getButtonColorClass(analysisResult.recommendations.primary.type)}`}>
                    Get Detailed {capitalizeFirstLetter(analysisResult.recommendations.primary.type)} Report
                  </Button>
                </CardFooter>
              </Card>

              <div className="grid gap-6 md:grid-cols-2">
                {analysisResult.recommendations.alternatives.map((alternative, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        {alternative.type === "solar" && <Sun className="h-6 w-6 mr-2 text-yellow-500" />}
                        {alternative.type === "wind" && <Wind className="h-6 w-6 mr-2 text-blue-500" />}
                        {alternative.type === "hydro" && <Droplets className="h-6 w-6 mr-2 text-cyan-500" />}
                        Alternative: {capitalizeFirstLetter(alternative.type)} Energy
                      </CardTitle>
                      <CardDescription>
                        {index === 0
                          ? "A viable secondary option with moderate efficiency in your area."
                          : "Limited potential due to your location's resources."}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between">
                        <div>
                          <h4 className="font-medium">Efficiency Rating</h4>
                          <div className={getTextColorClass(alternative.type) + " text-2xl font-bold"}>
                            {alternative.efficiency}%
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium">Cost Efficiency</h4>
                          <div className={getTextColorClass(alternative.type) + " text-2xl font-bold"}>
                            {alternative.costEfficiency}%
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium">Sustainability</h4>
                          <div className={getTextColorClass(alternative.type) + " text-2xl font-bold"}>
                            {alternative.sustainability}%
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 border-t">
                        <p className="text-sm text-muted-foreground">
                          {alternative.type === "solar" &&
                            "Solar panels could provide a reliable energy source for your location, especially during sunny periods."}
                          {alternative.type === "wind" &&
                            "Small-scale wind turbines could supplement your energy needs, especially during cloudy periods."}
                          {alternative.type === "hydro" &&
                            "Your location has limited access to flowing water sources required for hydro energy."}
                          {" Consider a hybrid system with multiple energy sources for optimal year-round performance."}
                        </p>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full">
                        Explore {capitalizeFirstLetter(alternative.type)} Options
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>

              {/* Add ML Insights Component */}
              <MLInsights analysisResult={analysisResult} className="mt-6" />
            </div>
          ) : (
            <Card>
              <CardContent className="py-10 text-center">
                <p>No analysis data available. Please complete the analysis form first.</p>
                <Button onClick={() => setActiveTab("analyze")} className="mt-4 bg-green-600 hover:bg-green-700">
                  Go to Analysis Form
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

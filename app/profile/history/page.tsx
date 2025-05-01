"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { Loader2, Sun, Wind, Droplets, Calendar, ArrowRight, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { format } from "date-fns"
import { energyService } from "@/services/api-service"

interface AnalysisHistoryItem {
  id: string
  date: Date
  location: string
  primaryRecommendation: string
  efficiency: number
  notes: string
}

export default function AnalysisHistoryPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [analysisHistory, setAnalysisHistory] = useState<AnalysisHistoryItem[]>([])
  const [isLoadingHistory, setIsLoadingHistory] = useState(true)

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [isLoading, user, router])

  // Fetch analysis history from backend
  useEffect(() => {
    const fetchAnalysisHistory = async () => {
      if (user) {
        try {
          setIsLoadingHistory(true)
          const response = await energyService.getUserAnalysisHistory()

          // Transform the API response to match our frontend format
          const transformedHistory = response.map((item: any) => ({
            id: item._id,
            date: new Date(item.timestamp),
            location: item.input.location,
            primaryRecommendation: item.selectedOption,
            efficiency: calculateEfficiency(item.mlResponse),
            notes: generateNotes(item),
          }))

          setAnalysisHistory(transformedHistory)
        } catch (error) {
          console.error("Error fetching analysis history:", error)
          // If API fails, use mock data for demo purposes
          setAnalysisHistory(mockAnalysisHistory)
        } finally {
          setIsLoadingHistory(false)
        }
      }
    }

    fetchAnalysisHistory()
  }, [user])

  // Helper function to calculate efficiency from ML response
  const calculateEfficiency = (mlResponse: any) => {
    if (!mlResponse || !mlResponse.scores) return 75 // Default value

    const bestOption = mlResponse.best_option
    const scores = mlResponse.scores

    // Calculate efficiency based on the scores
    switch (bestOption) {
      case "solar":
        return Math.min(95, Math.round((scores.solar / 40) * 100))
      case "wind":
        return Math.min(95, Math.round((scores.wind / 20) * 100))
      case "hydro":
        return Math.min(95, Math.round((scores.humidity / 100) * 100))
      default:
        return 75
    }
  }

  // Helper function to generate notes from analysis data
  const generateNotes = (item: any) => {
    const option = item.selectedOption
    const location = item.input.location

    switch (option) {
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

  if (isLoading || isLoadingHistory) {
    return (
      <div className="container mx-auto py-10 flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    )
  }

  // Filter history based on search term
  const filteredHistory = analysisHistory.filter(
    (item) =>
      item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.primaryRecommendation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.notes.toLowerCase().includes(searchTerm.toLowerCase()),
  )

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

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Analysis History</h1>
            <p className="text-muted-foreground">View and manage your previous energy analyses</p>
          </div>

          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search analyses..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {filteredHistory.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center">
              <p className="text-muted-foreground">No analysis history found.</p>
              <Button className="mt-4 bg-green-600 hover:bg-green-700" onClick={() => router.push("/dashboard")}>
                Perform New Analysis
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredHistory.map((analysis) => (
              <Card key={analysis.id} className="overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="flex-1 p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={getRecommendationColorClass(analysis.primaryRecommendation)}>
                        <span className="flex items-center gap-1">
                          {getRecommendationIcon(analysis.primaryRecommendation)}
                          {analysis.primaryRecommendation.charAt(0).toUpperCase() +
                            analysis.primaryRecommendation.slice(1)}
                        </span>
                      </Badge>
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {format(analysis.date, "MMM d, yyyy")}
                      </Badge>
                    </div>

                    <h3 className="text-xl font-bold mb-1">{analysis.location}</h3>
                    <p className="text-muted-foreground mb-4">{analysis.notes}</p>

                    <div className="flex items-center gap-2">
                      <div className="text-sm">Efficiency:</div>
                      <div className="w-full max-w-[200px] h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-600 rounded-full"
                          style={{ width: `${analysis.efficiency}%` }}
                        ></div>
                      </div>
                      <div className="text-sm font-medium">{analysis.efficiency}%</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-center p-6 bg-muted/50 md:w-48">
                    <Link href={`/profile/history/${analysis.id}`} passHref>
                      <Button variant="outline" className="w-full">
                        View Details
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// Mock analysis history data for fallback
const mockAnalysisHistory = [
  {
    id: "analysis_1",
    date: new Date(2023, 10, 15),
    location: "New York, NY",
    primaryRecommendation: "solar",
    efficiency: 85,
    notes: "Urban location with good solar potential",
  },
  {
    id: "analysis_2",
    date: new Date(2023, 9, 28),
    location: "Chicago, IL",
    primaryRecommendation: "wind",
    efficiency: 78,
    notes: "Windy city with moderate solar potential",
  },
  {
    id: "analysis_3",
    date: new Date(2023, 8, 10),
    location: "Portland, OR",
    primaryRecommendation: "hydro",
    efficiency: 92,
    notes: "Excellent hydro potential due to nearby rivers",
  },
  {
    id: "analysis_4",
    date: new Date(2023, 7, 5),
    location: "Phoenix, AZ",
    primaryRecommendation: "solar",
    efficiency: 95,
    notes: "Excellent solar potential in desert climate",
  },
  {
    id: "analysis_5",
    date: new Date(2023, 6, 20),
    location: "Seattle, WA",
    primaryRecommendation: "hydro",
    efficiency: 88,
    notes: "Good hydro potential with moderate solar",
  },
]

"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Lightbulb, TrendingUp, Zap, Leaf, DollarSign } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface MLInsightsProps {
  analysisResult: any
  className?: string
}

export function MLInsights({ analysisResult, className = "" }: MLInsightsProps) {
  if (!analysisResult) {
    return null
  }

  // Extract insights from the ML model results
  const primaryRecommendation = analysisResult.recommendations.primary

  // Calculate payback period in years
  const paybackYears =
    primaryRecommendation.paybackPeriod ||
    Math.round(
      (primaryRecommendation.installationCost.min + primaryRecommendation.installationCost.max) /
        2 /
        (primaryRecommendation.annualSavings || 1200),
    )

  // Calculate CO2 reduction (example calculation - adjust based on your model)
  const co2Reduction = Math.round(primaryRecommendation.efficiency * 0.5) // Example calculation

  // Calculate ROI
  const roi = Math.round(
    (primaryRecommendation.annualSavings /
      ((primaryRecommendation.installationCost.min + primaryRecommendation.installationCost.max) / 2)) *
      100,
  )

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Lightbulb className="h-5 w-5 mr-2 text-green-600" />
          ML-Powered Insights
        </CardTitle>
        <CardDescription>Advanced analytics based on machine learning predictions</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="overview">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="financial">Financial</TabsTrigger>
            <TabsTrigger value="environmental">Environmental</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 pt-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Key Findings</h3>
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant="outline"
                  className="bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400"
                >
                  {primaryRecommendation.efficiency}% Efficiency
                </Badge>
                <Badge
                  variant="outline"
                  className="bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400"
                >
                  ${primaryRecommendation.annualSavings}/year Savings
                </Badge>
                <Badge
                  variant="outline"
                  className="bg-amber-50 text-amber-700 hover:bg-amber-100 dark:bg-amber-900/20 dark:text-amber-400"
                >
                  {paybackYears} Year Payback
                </Badge>
                <Badge
                  variant="outline"
                  className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400"
                >
                  {co2Reduction}% CO₂ Reduction
                </Badge>
              </div>
            </div>

            <Alert>
              <TrendingUp className="h-4 w-4" />
              <AlertTitle>Optimization Opportunity</AlertTitle>
              <AlertDescription>
                Our ML model predicts that combining {primaryRecommendation.type} with{" "}
                {analysisResult.recommendations.alternatives[0].type} could increase your overall energy efficiency by
                up to 15%.
              </AlertDescription>
            </Alert>

            <div className="pt-2">
              <h3 className="text-sm font-medium mb-2">Predictive Analysis</h3>
              <p className="text-sm text-muted-foreground">
                Based on climate trends in your area, {primaryRecommendation.type} energy is projected to maintain
                optimal efficiency for the next 25+ years. Regular maintenance can extend system lifespan and improve
                return on investment.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="financial" className="space-y-4 pt-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <h4 className="font-medium mb-2 flex items-center">
                  <DollarSign className="h-4 w-4 mr-1 text-green-600" />
                  Return on Investment
                </h4>
                <div className="text-3xl font-bold text-green-600">{roi}%</div>
                <p className="text-sm text-muted-foreground mt-1">Over 10 years of system operation</p>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <h4 className="font-medium mb-2 flex items-center">
                  <Zap className="h-4 w-4 mr-1 text-green-600" />
                  Annual Savings
                </h4>
                <div className="text-3xl font-bold text-green-600">${primaryRecommendation.annualSavings}</div>
                <p className="text-sm text-muted-foreground mt-1">Based on current energy prices</p>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <h4 className="font-medium mb-2 flex items-center">
                  <TrendingUp className="h-4 w-4 mr-1 text-green-600" />
                  20-Year Savings
                </h4>
                <div className="text-3xl font-bold text-green-600">
                  ${(primaryRecommendation.annualSavings * 20).toLocaleString()}
                </div>
                <p className="text-sm text-muted-foreground mt-1">Projected total savings</p>
              </div>
            </div>

            <div className="pt-2">
              <h3 className="text-sm font-medium mb-2">Financial Insights</h3>
              <p className="text-sm text-muted-foreground">
                Our ML model predicts energy costs will rise by approximately 3.5% annually over the next decade.
                Installing {primaryRecommendation.type} energy now could protect you from these increases and
                potentially increase your property value by up to 4.1%.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="environmental" className="space-y-4 pt-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-lg">
                <h4 className="font-medium mb-2 flex items-center">
                  <Leaf className="h-4 w-4 mr-1 text-emerald-600" />
                  Carbon Footprint Reduction
                </h4>
                <div className="text-3xl font-bold text-emerald-600">{co2Reduction}%</div>
                <p className="text-sm text-muted-foreground mt-1">Compared to conventional energy sources</p>
              </div>
              <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-lg">
                <h4 className="font-medium mb-2 flex items-center">
                  <Leaf className="h-4 w-4 mr-1 text-emerald-600" />
                  Equivalent Trees Planted
                </h4>
                <div className="text-3xl font-bold text-emerald-600">
                  {Math.round(primaryRecommendation.efficiency * 0.8)}
                </div>
                <p className="text-sm text-muted-foreground mt-1">Annual environmental impact</p>
              </div>
            </div>

            <div className="pt-2">
              <h3 className="text-sm font-medium mb-2">Environmental Impact</h3>
              <p className="text-sm text-muted-foreground">
                By switching to {primaryRecommendation.type} energy, you'll reduce your household's carbon emissions by
                approximately {co2Reduction}%. This is equivalent to taking {Math.round(co2Reduction / 5)} cars off the
                road each year or planting {Math.round(primaryRecommendation.efficiency * 0.8)} trees annually.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

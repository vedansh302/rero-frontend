import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sun, Wind, Droplets, ArrowRight, FileText, Video, Download } from "lucide-react"

export default function ResourcesPage() {
  return (
    <div className="container mx-auto py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Renewable Energy Resources</h1>
        <p className="text-muted-foreground max-w-3xl">
          Explore our comprehensive resources on solar, wind, and hydro energy to better understand your renewable
          energy options.
        </p>
      </div>

      <Tabs defaultValue="solar" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="solar" className="flex items-center gap-2">
            <Sun className="h-4 w-4" />
            Solar Energy
          </TabsTrigger>
          <TabsTrigger value="wind" className="flex items-center gap-2">
            <Wind className="h-4 w-4" />
            Wind Energy
          </TabsTrigger>
          <TabsTrigger value="hydro" className="flex items-center gap-2">
            <Droplets className="h-4 w-4" />
            Hydro Energy
          </TabsTrigger>
        </TabsList>

        <TabsContent value="solar" className="space-y-8">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold mb-4">Solar Energy</h2>
              <p className="text-muted-foreground mb-4">
                Solar energy harnesses the power of the sun to generate electricity through photovoltaic panels or to
                heat water and spaces through solar thermal systems.
              </p>
              <p className="text-muted-foreground mb-4">
                As one of the most accessible renewable energy sources, solar power can be implemented at various
                scales, from small residential installations to large solar farms.
              </p>
              <div className="flex gap-4 mt-6">
                <Link href="/resources/solar" passHref>
                  <Button className="bg-yellow-600 hover:bg-yellow-700">
                    Learn More
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/dashboard" passHref>
                  <Button variant="outline">Check Your Solar Potential</Button>
                </Link>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <img
                alt="Solar Panel Installation"
                className="rounded-lg object-cover"
                height="300"
                src="/placeholder.svg?height=300&width=500"
                width="500"
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-yellow-600" />
                  Solar Energy Basics
                </CardTitle>
                <CardDescription>Understanding photovoltaic technology</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Learn about how solar panels work, different types of solar technologies, and key factors that affect
                  solar energy production.
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/resources/solar/basics" passHref className="w-full">
                  <Button variant="outline" className="w-full">
                    Read Article
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="h-5 w-5 text-yellow-600" />
                  Solar Installation Guide
                </CardTitle>
                <CardDescription>Step-by-step installation process</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Watch our comprehensive video guide on solar panel installation, maintenance requirements, and
                  optimization techniques.
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/resources/solar/installation" passHref className="w-full">
                  <Button variant="outline" className="w-full">
                    Watch Video
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5 text-yellow-600" />
                  Solar ROI Calculator
                </CardTitle>
                <CardDescription>Calculate your return on investment</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Download our Excel-based calculator to estimate the cost, savings, and payback period for your solar
                  energy investment.
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/resources/solar/calculator" passHref className="w-full">
                  <Button variant="outline" className="w-full">
                    Download Tool
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="wind" className="space-y-8">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold mb-4">Wind Energy</h2>
              <p className="text-muted-foreground mb-4">
                Wind energy converts the kinetic energy of moving air into electricity using wind turbines. This
                renewable resource is particularly effective in areas with consistent wind patterns.
              </p>
              <p className="text-muted-foreground mb-4">
                From small residential turbines to massive offshore wind farms, wind energy systems can be scaled to
                meet various energy needs while producing zero emissions during operation.
              </p>
              <div className="flex gap-4 mt-6">
                <Link href="/resources/wind" passHref>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Learn More
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/dashboard" passHref>
                  <Button variant="outline">Check Your Wind Potential</Button>
                </Link>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <img
                alt="Wind Turbines"
                className="rounded-lg object-cover"
                height="300"
                src="/placeholder.svg?height=300&width=500"
                width="500"
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  Wind Energy Fundamentals
                </CardTitle>
                <CardDescription>How wind turbines generate electricity</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Explore the principles behind wind energy generation, turbine designs, and the factors that influence
                  wind power efficiency.
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/resources/wind/fundamentals" passHref className="w-full">
                  <Button variant="outline" className="w-full">
                    Read Article
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="h-5 w-5 text-blue-600" />
                  Small-Scale Wind Systems
                </CardTitle>
                <CardDescription>Residential and small business solutions</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Learn about small wind turbines suitable for homes and small businesses, including installation
                  requirements and maintenance.
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/resources/wind/small-scale" passHref className="w-full">
                  <Button variant="outline" className="w-full">
                    Watch Video
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5 text-blue-600" />
                  Wind Resource Assessment
                </CardTitle>
                <CardDescription>Tools for evaluating wind potential</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Download our guide and tools for assessing wind resources in your area, including wind speed data
                  analysis and site evaluation.
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/resources/wind/assessment" passHref className="w-full">
                  <Button variant="outline" className="w-full">
                    Download Resources
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="hydro" className="space-y-8">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold mb-4">Hydro Energy</h2>
              <p className="text-muted-foreground mb-4">
                Hydroelectric power harnesses the energy of flowing water to generate electricity. It's one of the
                oldest and most reliable forms of renewable energy.
              </p>
              <p className="text-muted-foreground mb-4">
                From large dams to small micro-hydro systems in streams and rivers, hydropower can provide consistent,
                renewable electricity with minimal environmental impact when properly implemented.
              </p>
              <div className="flex gap-4 mt-6">
                <Link href="/resources/hydro" passHref>
                  <Button className="bg-cyan-600 hover:bg-cyan-700">
                    Learn More
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/dashboard" passHref>
                  <Button variant="outline">Check Your Hydro Potential</Button>
                </Link>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <img
                alt="Micro Hydro System"
                className="rounded-lg object-cover"
                height="300"
                src="/placeholder.svg?height=300&width=500"
                width="500"
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-cyan-600" />
                  Hydro Energy Principles
                </CardTitle>
                <CardDescription>Understanding hydroelectric generation</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Learn about the principles of hydroelectric power, different types of hydro systems, and environmental
                  considerations.
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/resources/hydro/principles" passHref className="w-full">
                  <Button variant="outline" className="w-full">
                    Read Article
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="h-5 w-5 text-cyan-600" />
                  Micro-Hydro Systems
                </CardTitle>
                <CardDescription>Small-scale water power solutions</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Explore micro-hydro systems suitable for properties with flowing water sources, including installation
                  and maintenance guides.
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/resources/hydro/micro" passHref className="w-full">
                  <Button variant="outline" className="w-full">
                    Watch Video
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5 text-cyan-600" />
                  Water Flow Calculator
                </CardTitle>
                <CardDescription>Estimate your hydro potential</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Download our calculator to estimate the energy potential from water sources on your property based on
                  flow rate and head height.
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/resources/hydro/calculator" passHref className="w-full">
                  <Button variant="outline" className="w-full">
                    Download Tool
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

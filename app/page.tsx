import Link from "next/link"
import { ArrowRight, Wind, Droplets, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-green-50 to-teal-50 dark:from-green-950/20 dark:to-teal-950/20">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Renewable Energy Resource Optimizer
                </h1>
                <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                  Find the optimal renewable energy solution for your location using AI-driven insights and real-time
                  weather data.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/dashboard" passHref>
                  <Button className="bg-green-600 hover:bg-green-700">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/about" passHref>
                  <Button variant="outline">Learn More</Button>
                </Link>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <img
                alt="Renewable Energy Visualization"
                className="aspect-video overflow-hidden rounded-xl object-cover object-center"
                height="310"
                src="/main.png?height=620&width=1100"
                width="550"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Optimize Your Energy Resources
              </h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Our platform analyzes your location, climate conditions, and energy consumption to recommend the most
                efficient renewable energy sources.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 lg:gap-12 mt-12">
            <Card className="flex flex-col items-center text-center border-2 border-yellow-200 dark:border-yellow-900/50">
              <CardHeader>
                <Sun className="h-12 w-12 text-yellow-500 mb-4" />
                <CardTitle>Solar Energy</CardTitle>
                <CardDescription>
                  Harness the power of the sun with photovoltaic panels and solar thermal systems.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Our system analyzes sunlight hours, panel efficiency, and installation costs to determine if solar is
                  right for you.
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/resources/solar" passHref>
                  <Button
                    variant="ghost"
                    className="text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
                  >
                    Learn More
                  </Button>
                </Link>
              </CardFooter>
            </Card>
            <Card className="flex flex-col items-center text-center border-2 border-blue-200 dark:border-blue-900/50">
              <CardHeader>
                <Wind className="h-12 w-12 text-blue-500 mb-4" />
                <CardTitle>Wind Energy</CardTitle>
                <CardDescription>
                  Capture wind power with turbines designed for various environments and scales.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  We assess wind patterns, turbine types, and land requirements to evaluate wind energy potential in
                  your area.
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/resources/wind" passHref>
                  <Button
                    variant="ghost"
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  >
                    Learn More
                  </Button>
                </Link>
              </CardFooter>
            </Card>
            <Card className="flex flex-col items-center text-center border-2 border-cyan-200 dark:border-cyan-900/50">
              <CardHeader>
                <Droplets className="h-12 w-12 text-cyan-500 mb-4" />
                <CardTitle>Hydro Energy</CardTitle>
                <CardDescription>
                  Utilize water flow from rivers, streams, and other water sources to generate power.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Our tools evaluate water resources, flow rates, and environmental factors to determine hydro energy
                  viability.
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/resources/hydro" passHref>
                  <Button
                    variant="ghost"
                    className="text-cyan-600 hover:text-cyan-700 hover:bg-cyan-50 dark:hover:bg-cyan-900/20"
                  >
                    Learn More
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900/50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">How It Works</h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Our data-driven approach helps you make informed decisions about renewable energy.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3 mt-12">
            <div className="flex flex-col items-center space-y-2 border-gray-200 p-4 rounded-lg">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-900 dark:bg-green-900/20 dark:text-green-100">
                <span className="font-bold text-xl">1</span>
              </div>
              <h3 className="text-xl font-bold">Input Your Location</h3>
              <p className="text-sm text-gray-500 text-center dark:text-gray-400">
                Provide your geographical location and energy consumption patterns.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 border-gray-200 p-4 rounded-lg">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-900 dark:bg-green-900/20 dark:text-green-100">
                <span className="font-bold text-xl">2</span>
              </div>
              <h3 className="text-xl font-bold">AI Analysis</h3>
              <p className="text-sm text-gray-500 text-center dark:text-gray-400">
                Our machine learning models analyze climate data, terrain, and energy requirements.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 border-gray-200 p-4 rounded-lg">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-900 dark:bg-green-900/20 dark:text-green-100">
                <span className="font-bold text-xl">3</span>
              </div>
              <h3 className="text-xl font-bold">Get Recommendations</h3>
              <p className="text-sm text-gray-500 text-center dark:text-gray-400">
                Receive personalized insights on the most suitable renewable energy sources for your needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-green-600 dark:bg-green-900">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center text-white">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Ready to Optimize Your Energy Resources?
              </h2>
              <p className="max-w-[900px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed opacity-90">
                Join thousands of users making data-driven decisions about renewable energy.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/signup" passHref>
                <Button className="bg-white text-green-600 hover:bg-gray-100">
                  Sign Up Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/contact" passHref>
                <Button variant="outline" className="text-green-600 border-green-600 hover:bg-green-50 dark:text-white dark:border-white dark:hover:bg-green-700">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-6 bg-gray-100 dark:bg-gray-900">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Renewable Energy Resource Optimizer</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Helping you make sustainable energy choices with data-driven insights.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-base font-medium">Resources</h3>
              <ul className="space-y-1 text-sm text-gray-500 dark:text-gray-400">
                <li>
                  <Link href="/resources/solar">Solar Energy</Link>
                </li>
                <li>
                  <Link href="/resources/wind">Wind Energy</Link>
                </li>
                <li>
                  <Link href="/resources/hydro">Hydro Energy</Link>
                </li>
                <li>
                  <Link href="/blog">Blog</Link>
                </li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="text-base font-medium">Company</h3>
              <ul className="space-y-1 text-sm text-gray-500 dark:text-gray-400">
                <li>
                  <Link href="/about">About Us</Link>
                </li>
                <li>
                  <Link href="/contact">Contact</Link>
                </li>
                <li>
                  <Link href="/privacy">Privacy Policy</Link>
                </li>
                <li>
                  <Link href="/terms">Terms of Service</Link>
                </li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="text-base font-medium">Connect</h3>
              <ul className="space-y-1 text-sm text-gray-500 dark:text-gray-400">
                <li>
                  <Link href="https://twitter.com">Twitter</Link>
                </li>
                <li>
                  <Link href="https://linkedin.com">LinkedIn</Link>
                </li>
                <li>
                  <Link href="https://facebook.com">Facebook</Link>
                </li>
                <li>
                  <Link href="https://instagram.com">Instagram</Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-200 pt-4 dark:border-gray-800">
            <p className="text-xs text-gray-500 text-center dark:text-gray-400">
              © 2025 Renewable Energy Resource Optimizer. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Users, Lightbulb, BarChart3, Globe } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="container mx-auto py-10 space-y-12">
      <section className="space-y-4">
        <h1 className="text-4xl font-bold">About the Renewable Energy Resource Optimizer</h1>
        <p className="text-xl text-muted-foreground max-w-3xl">
          Our mission is to bridge the gap between renewable energy awareness and actionable implementation by offering
          users clear insights, resource recommendations, and energy efficiency strategies.
        </p>
      </section>

      <section className="grid gap-8 md:grid-cols-2">
        <div>
          <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
          <p className="text-muted-foreground mb-4">
            The Renewable Energy Resource Optimizer was created to address the critical energy crisis facing our world
            today. With increasing demand for sustainable energy solutions, we recognized the need for a tool that could
            help individuals and businesses make informed decisions about renewable energy adoption.
          </p>
          <p className="text-muted-foreground mb-4">
            Our vision is a world where everyone has access to personalized, data-driven insights about renewable energy
            options, making the transition to clean energy simpler and more accessible.
          </p>
          <p className="text-muted-foreground">
            By leveraging machine learning and real-time weather data, we provide recommendations that are tailored to
            each user's specific location, climate conditions, and energy needs.
          </p>
        </div>
        <div className="bg-muted rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">The Problem We're Solving</h2>
          <ul className="space-y-4">
            <li className="flex items-start">
              <div className="mr-4 mt-1 bg-green-100 dark:bg-green-900/20 p-2 rounded-full">
                <BarChart3 className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium">Lack of Personalized Recommendations</h3>
                <p className="text-sm text-muted-foreground">
                  Many businesses and homeowners struggle to identify which renewable energy source is best suited for
                  their location.
                </p>
              </div>
            </li>
            <li className="flex items-start">
              <div className="mr-4 mt-1 bg-green-100 dark:bg-green-900/20 p-2 rounded-full">
                <Users className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium">Complex Assessment Methods</h3>
                <p className="text-sm text-muted-foreground">
                  Existing energy assessment models are technical and costly, making it difficult for small-scale users
                  to access relevant insights.
                </p>
              </div>
            </li>
            <li className="flex items-start">
              <div className="mr-4 mt-1 bg-green-100 dark:bg-green-900/20 p-2 rounded-full">
                <Lightbulb className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium">Inefficient Energy Planning</h3>
                <p className="text-sm text-muted-foreground">
                  Without data-driven insights, users may invest in suboptimal renewable energy solutions that do not
                  maximize efficiency.
                </p>
              </div>
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6">Our Approach</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <div className="mb-4 bg-green-100 dark:bg-green-900/20 p-3 rounded-full w-fit">
                <Globe className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Data-Driven Analysis</h3>
              <p className="text-muted-foreground">
                We integrate real-time climate data, geographical factors, and energy consumption patterns to provide
                accurate recommendations.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="mb-4 bg-green-100 dark:bg-green-900/20 p-3 rounded-full w-fit">
                <BarChart3 className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Machine Learning</h3>
              <p className="text-muted-foreground">
                Our algorithms analyze patterns and predict which renewable energy sources will perform best in your
                specific location.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="mb-4 bg-green-100 dark:bg-green-900/20 p-3 rounded-full w-fit">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">User-Friendly Interface</h3>
              <p className="text-muted-foreground">
                We present complex data in an accessible way, making it easy for anyone to understand their renewable
                energy options.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="bg-green-50 dark:bg-green-900/20 p-8 rounded-lg">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <h2 className="text-2xl font-bold">Ready to find your optimal renewable energy solution?</h2>
          <p className="text-muted-foreground">
            Join thousands of users who are making data-driven decisions about renewable energy with our platform.
          </p>
          <div className="flex justify-center gap-4 pt-2">
            <Link href="/signup" passHref>
              <Button className="bg-green-600 hover:bg-green-700">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/contact" passHref>
              <Button variant="outline">Contact Us</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/contexts/auth-context"
import { Loader2, Camera, User, Lock, History, SettingsIcon } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Link from "next/link"

export default function ProfilePage() {
  const { user, updateProfile, isLoading } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("personal")
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const [personalInfo, setPersonalInfo] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    location: "",
  })

  const [passwordInfo, setPasswordInfo] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [isUpdating, setIsUpdating] = useState(false)

  // Redirect if not logged in
  if (!isLoading && !user) {
    router.push("/login")
    return null
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-10 flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    )
  }

  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPersonalInfo((prev) => ({ ...prev, [name]: value }))

    // Clear messages
    setSuccessMessage(null)
    setErrorMessage(null)
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordInfo((prev) => ({ ...prev, [name]: value }))

    // Clear messages
    setSuccessMessage(null)
    setErrorMessage(null)
  }

  const handlePersonalInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdating(true)
    setSuccessMessage(null)
    setErrorMessage(null)

    try {
      await updateProfile({
        name: personalInfo.name,
        // We don't update email in this demo
      })
      setSuccessMessage("Profile updated successfully!")
    } catch (error) {
      setErrorMessage("Failed to update profile. Please try again.")
      console.error("Profile update error:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdating(true)
    setSuccessMessage(null)
    setErrorMessage(null)

    // Validate passwords
    if (passwordInfo.newPassword.length < 8) {
      setErrorMessage("New password must be at least 8 characters")
      setIsUpdating(false)
      return
    }

    if (passwordInfo.newPassword !== passwordInfo.confirmPassword) {
      setErrorMessage("New passwords do not match")
      setIsUpdating(false)
      return
    }

    try {
      // In a real app, you would call an API to update the password
      // For this demo, we'll just simulate a successful update
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setSuccessMessage("Password updated successfully!")
      setPasswordInfo({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
    } catch (error) {
      setErrorMessage("Failed to update password. Please try again.")
      console.error("Password update error:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleProfilePictureChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // In a real app, you would upload the file to a server
    // For this demo, we'll just simulate a successful upload
    setIsUpdating(true)
    setSuccessMessage(null)
    setErrorMessage(null)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Create a fake URL for the uploaded image
      // In a real app, this would be the URL returned by your file upload service
      const fakeImageUrl = "/placeholder.svg?height=200&width=200&text=New"

      await updateProfile({
        profileImage: fakeImageUrl,
      })

      setSuccessMessage("Profile picture updated successfully!")
    } catch (error) {
      setErrorMessage("Failed to update profile picture. Please try again.")
      console.error("Profile picture update error:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={user.profileImage || "/placeholder.svg?height=96&width=96"} alt={user.name} />
                    <AvatarFallback className="text-2xl">{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <label
                    htmlFor="profile-picture"
                    className="absolute bottom-0 right-0 bg-green-600 text-white p-1 rounded-full cursor-pointer"
                  >
                    <Camera className="h-4 w-4" />
                    <input
                      id="profile-picture"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleProfilePictureChange}
                      disabled={isUpdating}
                    />
                  </label>
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-bold">{user.name}</h3>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>

              <div className="mt-6 space-y-2">
                <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab("personal")}>
                  <User className="mr-2 h-4 w-4" />
                  Personal Information
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab("security")}>
                  <Lock className="mr-2 h-4 w-4" />
                  Security
                </Button>
                <Link href="/profile/history" passHref>
                  <Button variant="outline" className="w-full justify-start">
                    <History className="mr-2 h-4 w-4" />
                    Analysis History
                  </Button>
                </Link>
                <Link href="/profile/settings" passHref>
                  <Button variant="outline" className="w-full justify-start">
                    <SettingsIcon className="mr-2 h-4 w-4" />
                    Settings
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:w-3/4">
          {successMessage && (
            <Alert className="mb-4">
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>{successMessage}</AlertDescription>
            </Alert>
          )}

          {errorMessage && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="personal">Personal Information</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>

            <TabsContent value="personal">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Update your personal details here. Your name will be displayed on your profile.
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handlePersonalInfoSubmit}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={personalInfo.name}
                        onChange={handlePersonalInfoChange}
                        disabled={isUpdating}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        value={personalInfo.email}
                        onChange={handlePersonalInfoChange}
                        disabled={true}
                        className="bg-muted"
                      />
                      <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number (optional)</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={personalInfo.phone}
                        onChange={handlePersonalInfoChange}
                        disabled={isUpdating}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">Location (optional)</Label>
                      <Input
                        id="location"
                        name="location"
                        value={personalInfo.location}
                        onChange={handlePersonalInfoChange}
                        disabled={isUpdating}
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={isUpdating}>
                      {isUpdating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>

            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>Security</CardTitle>
                  <CardDescription>
                    Update your password here. We recommend using a strong, unique password.
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handlePasswordSubmit}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input
                        id="currentPassword"
                        name="currentPassword"
                        type="password"
                        value={passwordInfo.currentPassword}
                        onChange={handlePasswordChange}
                        disabled={isUpdating}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        name="newPassword"
                        type="password"
                        value={passwordInfo.newPassword}
                        onChange={handlePasswordChange}
                        disabled={isUpdating}
                      />
                      <p className="text-xs text-muted-foreground">Password must be at least 8 characters</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={passwordInfo.confirmPassword}
                        onChange={handlePasswordChange}
                        disabled={isUpdating}
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={isUpdating}>
                      {isUpdating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        "Update Password"
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

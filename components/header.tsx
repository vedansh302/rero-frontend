"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Menu, X, Sun, Moon, User, LogOut, Settings, History } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { useAuth } from "@/contexts/auth-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const { user, logout } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold">RERO</span>
          </Link>
        </div>
        <nav className="hidden md:flex gap-6">
          <Link href="/" className="text-sm font-medium hover:underline underline-offset-4">Home</Link>
          <Link href="/dashboard" className="text-sm font-medium hover:underline underline-offset-4">Dashboard</Link>
          <Link href="/resources" className="text-sm font-medium hover:underline underline-offset-4">Resources</Link>
          <Link href="/about" className="text-sm font-medium hover:underline underline-offset-4">About</Link>
          <Link href="/contact" className="text-sm font-medium hover:underline underline-offset-4">Contact</Link>
        </nav>
        <div className="flex items-center gap-2">
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="mr-2"
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              <span className="sr-only">Toggle theme</span>
            </Button>
          )}

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.profileImage || "/placeholder.svg?height=32&width=32"} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/profile")}> <User className="mr-2 h-4 w-4" /> <span>Profile</span> </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/profile/history")}> <History className="mr-2 h-4 w-4" /> <span>Analysis History</span> </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/profile/settings")}> <Settings className="mr-2 h-4 w-4" /> <span>Settings</span> </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}> <LogOut className="mr-2 h-4 w-4" /> <span>Log out</span> </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden md:flex gap-2">
              <Link href="/login" passHref><Button variant="outline">Log In</Button></Link>
              <Link href="/signup" passHref><Button className="bg-green-600 hover:bg-green-700">Sign Up</Button></Link>
            </div>
          )}

          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden border-t">
          <div className="container py-4 grid gap-4">
            <Link href="/" className="text-sm font-medium" onClick={() => setIsMenuOpen(false)}>Home</Link>
            <Link href="/dashboard" className="text-sm font-medium" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
            <Link href="/resources" className="text-sm font-medium" onClick={() => setIsMenuOpen(false)}>Resources</Link>
            <Link href="/about" className="text-sm font-medium" onClick={() => setIsMenuOpen(false)}>About</Link>
            <Link href="/contact" className="text-sm font-medium" onClick={() => setIsMenuOpen(false)}>Contact</Link>

            {user ? (
              <>
                <div className="pt-2 border-t flex items-center">
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarImage src={user.profileImage || "/placeholder.svg?height=32&width=32"} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <Link href="/profile" className="text-sm font-medium" onClick={() => setIsMenuOpen(false)}>Profile</Link>
                <Link href="/profile/history" className="text-sm font-medium" onClick={() => setIsMenuOpen(false)}>Analysis History</Link>
                <Link href="/profile/settings" className="text-sm font-medium" onClick={() => setIsMenuOpen(false)}>Settings</Link>
                <Button variant="destructive" onClick={handleLogout}>Log out</Button>
              </>
            ) : (
              <div className="flex gap-2 pt-2 border-t">
                <Link href="/login" passHref className="w-full" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" className="w-full">Log In</Button>
                </Link>
                <Link href="/signup" passHref className="w-full" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full bg-green-600 hover:bg-green-700">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

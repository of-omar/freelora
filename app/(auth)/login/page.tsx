"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Eye, EyeOff, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

export default function LoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: any) => {
  e.preventDefault()

  setIsLoading(true)

  setTimeout(() => {
    localStorage.setItem("demo-mode", "true")

    localStorage.setItem(
      "token",
      "portfolio-demo-token"
    )

    router.push("/dashboard")

    setIsLoading(false)
  }, 800)
}

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:64px_64px]" />

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
              <span className="text-lg font-bold text-white">F</span>
            </div>

            <span className="text-2xl font-semibold text-white">
              Freelora
            </span>
          </div>

          <div className="space-y-6">
            <h1 className="text-4xl font-bold text-white leading-tight">
              Manage your freelance business with ease
            </h1>

            <p className="text-lg text-white/80 max-w-md">
              Track clients, projects, tasks, and earnings all in one beautiful dashboard.
            </p>
            <div className="mt-3 rounded-lg border border-primary/20 bg-primary/10 p-3">
  <p className="text-sm text-primary font-medium">
    Portfolio Demo Version
  </p>

  <p className="text-xs text-muted-foreground mt-1">
    Any email and password will work.
  </p>
</div>
          </div>

          <p className="text-sm text-white/60">
            Trusted by over 10,000 freelancers worldwide
          </p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-8">

          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 justify-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
              <span className="text-lg font-bold text-primary-foreground">
                F
              </span>
            </div>

            <span className="text-2xl font-semibold text-foreground">
              Freelora
            </span>
          </div>

          <div className="space-y-2 text-center lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              Welcome back
            </h2>

            <p className="text-muted-foreground">
              Enter your credentials to access your account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">

            <div className="space-y-4">

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">
                  Email
                </Label>

                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  required
                  className="h-11"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* Password */}
              <div className="space-y-2">

                <div className="flex items-center justify-between">
                  <Label htmlFor="password">
                    Password
                  </Label>

                  <Link
                    href="/forgot-password"
                    className="text-sm text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>

                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    required
                    className="h-11 pr-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}

                    <span className="sr-only">
                      Toggle password
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className={cn("w-full h-11")}
              disabled={isLoading}
            >
              {isLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}

              Sign in
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            {"Don't have an account? "}

            <Link
              href="/register"
              className="text-primary hover:underline font-medium"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
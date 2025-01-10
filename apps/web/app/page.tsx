// app/page.tsx
import { Button } from "./components/ui/button"
import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container mx-auto px-4">
        {/* Header */}
        <header className="py-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">PayApp</h1>
          <div className="space-x-4">
            <Link href="/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link href="/register">
              <Button>Register</Button>
            </Link>
          </div>
        </header>

        {/* Hero Section */}
        <main className="py-20 text-center">
          <h2 className="text-5xl font-bold text-white mb-6">
            Send Money Instantly
          </h2>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            A simple and secure way to send money to anyone using just their username.
          </p>
          <Link href="/register">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Get Started
            </Button>
          </Link>
        </main>
      </div>
    </div>
  )
}
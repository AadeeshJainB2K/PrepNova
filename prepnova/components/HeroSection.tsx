"use client";

import { Button } from "@/components/ui/button";
import SplineScene from "@/components/SplineScene";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="min-h-[calc(100vh-3.5rem)] sm:min-h-screen pt-14 sm:pt-16 flex items-center bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Column - Content */}
          <div className="space-y-6 sm:space-y-8 text-center lg:text-left order-2 lg:order-1">
            <div className="space-y-3 sm:space-y-4">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Your Gateway to
                </span>
                <br />
                <span className="text-gray-900 dark:text-gray-100">Exam Success</span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto lg:mx-0">
                Master JEE, NEET, CLAT, and more with AI-powered mock tests, 
                real-time progress tracking, and a community of fellow aspirants.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
              <Link href="/dashboard/exams">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 w-full sm:w-auto"
                >
                  Browse Exams
                </Button>
              </Link>
              <Link href="/dashboard/mock-tests">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 border-2 dark:border-gray-600 dark:hover:bg-gray-800 w-full sm:w-auto"
                >
                  Start Mock Test
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 sm:gap-6 lg:gap-8 pt-6 sm:pt-8">
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">6+</div>
                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Major Exams</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">10K+</div>
                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Active Users</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">AI</div>
                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Powered</div>
              </div>
            </div>
          </div>

          {/* Right Column - 3D Spline */}
          <div className="relative h-64 sm:h-80 md:h-96 lg:h-[500px] xl:h-[600px] rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 order-1 lg:order-2">
            <SplineScene 
              sceneUrl="https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode"
              className="w-full h-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

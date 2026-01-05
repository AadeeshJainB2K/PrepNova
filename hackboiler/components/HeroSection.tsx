"use client";

import { Button } from "@/components/ui/button";
import Spline from "@splinetool/react-spline";

export function HeroSection() {
  return (
    <section className="min-h-screen pt-16 flex items-center bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="space-y-8 text-center lg:text-left">
            <div className="space-y-4">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Build Your Next
                </span>
                <br />
                <span className="text-gray-900 dark:text-gray-100">Hackathon Project</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl">
                A production-ready boilerplate with Next.js 15, Auth.js, 3D visuals, 
                and AI scaffolding. Ship faster, win bigger.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-6"
              >
                Get Started
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg px-8 py-6 border-2 dark:border-gray-600 dark:hover:bg-gray-800"
              >
                View Docs
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8">
              <div>
                <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">10x</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Faster Setup</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">100%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Type Safe</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">AI</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Ready</div>
              </div>
            </div>
          </div>

          {/* Right Column - 3D Spline */}
          <div className="relative h-[500px] lg:h-[600px] rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20">
            <Spline 
              scene="https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode"
              className="w-full h-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

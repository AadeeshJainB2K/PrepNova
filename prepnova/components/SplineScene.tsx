'use client';

import { Suspense, useState } from "react";
import dynamic from "next/dynamic";

const Spline = dynamic(() => import("@splinetool/react-spline"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20">
      <div className="text-center space-y-3">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="text-sm text-gray-600 dark:text-gray-400">Loading 3D scene...</p>
      </div>
    </div>
  ),
});

interface SplineSceneProps {
  sceneUrl: string;
  className?: string;
}

export default function SplineScene({ sceneUrl, className }: SplineSceneProps) {
  const [error, setError] = useState(false);



  if (error) {
    return (
      <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 ${className}`}>
        <div className="text-center space-y-2 p-4">
          <div className="text-4xl">🎨</div>
          <p className="text-sm text-gray-600 dark:text-gray-400">3D scene unavailable</p>
        </div>
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20">
          <div className="text-center space-y-3">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Loading 3D scene...</p>
          </div>
        </div>
      }
    >
      <div className={className} style={{ touchAction: 'pan-y' }}>
        <Spline
          scene={sceneUrl}
          onError={() => setError(true)}
        />
      </div>
    </Suspense>
  );
}

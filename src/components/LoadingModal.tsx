"use client";
import React from "react";

export default function FullScreenLoader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/80 dark:bg-black/80 backdrop-blur-sm z-[9999]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
        <p className="text-gray-700 dark:text-gray-200 font-medium text-lg">
          Loading...
        </p>
      </div>
    </div>
  );
}

'use client'

import { redirect } from "next/navigation";

export default function ReloadPage() {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background-secondary from-gray-100 to-gray-300 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100 px-6">
        <h1 className="text-4xl md:text-6xl font-extrabold text-center mb-6">
        Please reload the page
        </h1>

        <button
          onClick={() => redirect("/")}
          className="px-6 py-3 text-lg font-semibold text-white bg-blue-600 rounded-lg shadow-lg hover:bg-blue-700 active:scale-95 transition-transform duration-200"
        >
          Reload Page
        </button>
      </div>
    );
  }

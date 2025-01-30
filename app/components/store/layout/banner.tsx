import type React from "react"
import { useState } from "react"

interface SportsBannerProps {
  message: string
  visible: boolean
}

const SportsBanner: React.FC<SportsBannerProps> = ({ message, visible }) => {
  const [isVisible, setIsVisible] = useState(visible)

  if (!isVisible) return null

  return (
    <div className="relative bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 text-white py-3 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto relative grid grid-cols-[1fr,auto]">
        <div className="flex items-center justify-center">
          <div className="flex-shrink-0">
            <svg className="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
              />
            </svg>
          </div>
          <div className="ml-3 font-medium text-lg sm:text-xl tracking-wide">{message}</div>
        </div>
        <div>
          <button
            type="button"
            className="flex p-2 rounded-md hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-white"
            onClick={() => setIsVisible(false)}
          >
            <span className="sr-only">Dismiss</span>
            <svg
              className="h-6 w-6 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500"></div>
    </div>
  )
}

export default SportsBanner


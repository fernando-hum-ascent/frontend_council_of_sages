export function HomePage() {
  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      <div className="text-center">
        <h1 className="mb-4 text-3xl font-bold text-gray-900 sm:mb-6 sm:text-4xl lg:text-5xl dark:text-white">
          Welcome to Council of Sages
        </h1>
        <p className="mx-auto mb-6 max-w-3xl text-lg text-gray-600 sm:mb-8 sm:text-xl dark:text-gray-300">
          Your AI-powered application for intelligent workflows and
          decision-making.
        </p>
        <div className="mx-auto max-w-4xl space-y-4 sm:space-y-6">
          <div className="rounded-lg bg-white p-4 shadow-md sm:p-6 dark:bg-gray-800">
            <h2 className="mb-3 text-xl font-semibold sm:mb-4 sm:text-2xl">
              Getting Started
            </h2>
            <p className="text-sm leading-relaxed text-gray-600 sm:text-base dark:text-gray-300">
              This is your React frontend application with modern tooling and
              best practices. It's designed to be responsive and ready for both
              web and mobile experiences.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            <div className="rounded-lg bg-white p-4 shadow-md sm:p-6 dark:bg-gray-800">
              <h3 className="mb-2 text-lg font-semibold text-blue-600 dark:text-blue-400">
                Responsive Design
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Mobile-first design with touch-friendly interactions
              </p>
            </div>
            <div className="rounded-lg bg-white p-4 shadow-md sm:p-6 dark:bg-gray-800">
              <h3 className="mb-2 text-lg font-semibold text-green-600 dark:text-green-400">
                Cross-Platform Ready
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Architecture designed for easy React Native migration
              </p>
            </div>
            <div className="rounded-lg bg-white p-4 shadow-md sm:col-span-2 sm:p-6 lg:col-span-1 dark:bg-gray-800">
              <h3 className="mb-2 text-lg font-semibold text-purple-600 dark:text-purple-400">
                Modern Stack
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                TypeScript, React Query, Zustand, and Tailwind CSS
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-6 text-4xl font-bold text-gray-900 dark:text-white">
          About Council of Sages
        </h1>
        <div className="prose prose-lg dark:prose-invert">
          <p className="mb-6 text-xl text-gray-600 dark:text-gray-300">
            Council of Sages is an AI-powered application designed to facilitate
            intelligent workflows and multi-agent systems.
          </p>

          <div className="mb-6 rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
            <h2 className="mb-4 text-2xl font-semibold">Technology Stack</h2>
            <ul className="space-y-2 text-gray-600 dark:text-gray-300">
              <li>• React 18 with TypeScript</li>
              <li>• Vite for fast development and builds</li>
              <li>• Tailwind CSS for styling</li>
              <li>• React Query for data fetching</li>
              <li>• Zustand for state management</li>
              <li>• React Hook Form with Zod validation</li>
            </ul>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
            <h2 className="mb-4 text-2xl font-semibold">Features</h2>
            <ul className="space-y-2 text-gray-600 dark:text-gray-300">
              <li>• Modern React development with best practices</li>
              <li>• Type-safe development with TypeScript</li>
              <li>• Responsive design with Tailwind CSS</li>
              <li>• Efficient data fetching and caching</li>
              <li>• Form handling with validation</li>
              <li>• Error boundaries for robust UX</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

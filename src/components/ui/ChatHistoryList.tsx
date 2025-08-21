import { MessageSquare } from 'lucide-react'

export function ChatHistoryList() {
  return (
    <div className="space-y-2">
      {/* Future implementation will include:
          - List of conversation summaries
          - Search functionality
          - Date grouping
          - Delete/rename options
          - Infinite scrolling
      */}

      <div className="py-8 text-center text-sm text-gray-500">
        <MessageSquare className="mx-auto mb-2 h-8 w-8 opacity-50" />
        <p>Chat history coming soon</p>
        <p className="mt-1 text-xs">Future feature</p>
      </div>

      {/* Example structure for future implementation:
          
          <div className="space-y-1">
            <div className="text-xs font-medium text-gray-600 px-2 py-1">
              Today
            </div>
            <button className="w-full text-left rounded-md p-2 text-sm text-gray-700 hover:bg-gray-200 hover:text-gray-900 transition-colors">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-3 w-3" />
                <span className="truncate">Project planning discussion</span>
              </div>
            </button>
            <button className="w-full text-left rounded-md p-2 text-sm text-gray-700 hover:bg-gray-200 hover:text-gray-900 transition-colors">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-3 w-3" />
                <span className="truncate">Code review questions</span>
              </div>
            </button>
          </div>
      */}
    </div>
  )
}

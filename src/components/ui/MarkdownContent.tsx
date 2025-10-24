import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeSanitize from 'rehype-sanitize'

interface MarkdownContentProps {
  content: string
  className?: string
}

export function MarkdownContent({
  content,
  className = '',
}: MarkdownContentProps) {
  return (
    <div className={`markdown-content ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSanitize]}
        components={{
          // Headings
          h1: ({ children }) => (
            <h1 className="mb-4 mt-6 text-2xl font-bold text-gray-900 dark:text-white">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="mb-3 mt-5 text-xl font-bold text-gray-900 dark:text-white">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="mb-2 mt-4 text-lg font-semibold text-gray-900 dark:text-white">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="mb-2 mt-3 text-base font-semibold text-gray-900 dark:text-white">
              {children}
            </h4>
          ),
          h5: ({ children }) => (
            <h5 className="mb-2 mt-3 text-sm font-semibold text-gray-900 dark:text-white">
              {children}
            </h5>
          ),
          h6: ({ children }) => (
            <h6 className="mb-2 mt-3 text-xs font-semibold text-gray-900 dark:text-white">
              {children}
            </h6>
          ),
          // Paragraphs
          p: ({ children }) => (
            <p className="mb-3 whitespace-pre-wrap leading-relaxed text-gray-900 dark:text-gray-100">
              {children}
            </p>
          ),
          // Strong (bold)
          strong: ({ children }) => (
            <strong className="font-bold text-gray-900 dark:text-white">
              {children}
            </strong>
          ),
          // Emphasis (italic)
          em: ({ children }) => (
            <em className="italic text-gray-900 dark:text-gray-100">
              {children}
            </em>
          ),
          // Lists
          ul: ({ children }) => (
            <ul className="mb-3 ml-6 list-disc space-y-1 text-gray-900 dark:text-gray-100">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="mb-3 ml-6 list-decimal space-y-1 text-gray-900 dark:text-gray-100">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="leading-relaxed text-gray-900 dark:text-gray-100">
              {children}
            </li>
          ),
          // Blockquotes
          blockquote: ({ children }) => (
            <blockquote className="my-3 border-l-4 border-sage/40 bg-sage/5 py-2 pl-4 pr-3 italic text-gray-800 dark:border-sage/60 dark:bg-sage/10 dark:text-gray-200">
              {children}
            </blockquote>
          ),
          // Code
          code: ({ className, children }) => {
            // Inline code vs code block
            const isInline = !className
            if (isInline) {
              return (
                <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-sm text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                  {children}
                </code>
              )
            }
            // Code block
            return (
              <code className="block overflow-x-auto rounded-lg bg-gray-100 p-3 font-mono text-sm text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                {children}
              </code>
            )
          },
          pre: ({ children }) => (
            <pre className="my-3 overflow-x-auto">{children}</pre>
          ),
          // Links
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sage underline hover:text-sage/80 dark:text-sage/90 dark:hover:text-sage/70"
            >
              {children}
            </a>
          ),
          // Horizontal rule
          hr: () => (
            <hr className="my-4 border-t border-gray-300 dark:border-gray-700" />
          ),
          // Tables (GFM)
          table: ({ children }) => (
            <div className="my-3 overflow-x-auto">
              <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-700">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-gray-100 dark:bg-gray-800">{children}</thead>
          ),
          tbody: ({ children }) => <tbody>{children}</tbody>,
          tr: ({ children }) => (
            <tr className="border-b border-gray-300 dark:border-gray-700">
              {children}
            </tr>
          ),
          th: ({ children }) => (
            <th className="border border-gray-300 px-4 py-2 text-left font-semibold text-gray-900 dark:border-gray-700 dark:text-white">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-gray-300 px-4 py-2 text-gray-900 dark:border-gray-700 dark:text-gray-100">
              {children}
            </td>
          ),
          // Strikethrough (GFM)
          del: ({ children }) => (
            <del className="text-gray-600 line-through dark:text-gray-400">
              {children}
            </del>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}

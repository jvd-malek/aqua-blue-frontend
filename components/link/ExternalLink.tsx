import { isInstagramLink } from '@/utils/link/linkUtils'

type Props = { url: string; linkText: string }

export default function ExternalLink({ url, linkText }: Props) {
  const isInstagram = isInstagramLink(url)

  return (
    <div className="mt-2">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center gap-1.5 text-sm rounded-md px-2 py-1 ring-2 ring-offset-2 transition-all ${
          isInstagram
            ? 'text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/30 ring-rose-300 dark:ring-rose-700 hover:bg-rose-100 dark:hover:bg-rose-900/50'
            : 'text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 ring-blue-300 dark:ring-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900/50'
        }`}
      >
        {isInstagram && <span className="text-rose-500">📸</span>}
        <span className="line-clamp-1">{linkText}</span>
        <span className="text-xs">↗</span>
      </a>
    </div>
  )
}

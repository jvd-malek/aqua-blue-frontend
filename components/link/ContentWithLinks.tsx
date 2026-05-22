import InternalLink from './InternalLink'
import ExternalLink from './ExternalLink'
import { isInternalLink, parseBold } from '@/utils/link/linkUtils'

function parseLinks(text: string): React.ReactNode[] {
  if (!text) return []
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g
  const parts = text.split(linkRegex)
  const result: React.ReactNode[] = []

  for (let i = 0; i < parts.length; i += 3) {
    if (i + 2 < parts.length) {
      const beforeText = parts[i]
      const linkText = parts[i + 1]
      const url = parts[i + 2]

      if (beforeText) result.push(...parseBold(beforeText, `b-${i}`))

      result.push(
        isInternalLink(url)
          ? <InternalLink key={`l-${i}`} url={url} linkText={linkText} />
          : <ExternalLink key={`l-${i}`} url={url} linkText={linkText} />,
      )
    } else {
      const remaining = parts[i]
      if (remaining) result.push(...parseBold(remaining, `r-${i}`))
    }
  }
  return result
}

export default function ContentWithLinks({ content }: { content: string }) {
  if (!content) return <span className="whitespace-pre-line" />
  return <span className="whitespace-pre-line">{parseLinks(content)}</span>
}

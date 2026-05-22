import NextLink from 'next/link'

type Props = { url: string; linkText: string }

export default function InternalLink({ url, linkText }: Props) {
  return (
    <div className="mt-2">
      <NextLink
        href={url}
        className="text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/30 ring-2 ring-green-300 dark:ring-green-700 ring-offset-2 hover:bg-green-100 dark:hover:bg-green-900/50 transition-all rounded-md px-2 py-1 inline-flex items-center gap-1.5 text-sm"
      >
        <span className="line-clamp-1">{linkText}</span>
        <span className="text-xs">🔗</span>
      </NextLink>
    </div>
  )
}

export const isInternalLink = (url: string): boolean => url.startsWith('/') || url.startsWith('#')
export const isInstagramLink = (url: string): boolean => url.includes('instagram.com') || url.includes('instagr.am')

export function parseBold(text: string, keyPrefix: string): React.ReactNode[] {
  const parts = text.split(/\*([^*]+)\*/g)
  return parts.map((part, j) => {
    if (j % 2 === 1) {
      return <strong key={`${keyPrefix}-b-${j}`}>{part}</strong>
    }
    return part ? <span key={`${keyPrefix}-p-${j}`}>{part}</span> : null
  })
}

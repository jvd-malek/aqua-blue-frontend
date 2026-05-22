import { cookies } from 'next/headers'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3815/api'

export const revalidateOneHour = 3600
export const revalidateOneDay = 86400
export const noStore = 'no-store' as const

export type FetchOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  body?: Record<string, unknown>
  cache?: RequestCache
  revalidate?: number
  tags?: string[]
}

export async function serverFetch<T = unknown>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<{ data: T | null; error: string | null; success: boolean }> {
  try {
    const cookieJar = await cookies()
    const token = cookieJar.get('token')?.value

    const { method = 'GET', body, cache, revalidate, tags } = options

    const res = await fetch(`${API_URL}${endpoint}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: token }),
      },
      body: body ? JSON.stringify(body) : undefined,
      ...(cache ? { cache } : {}),
      next: {
        ...(revalidate ? { revalidate } : {}),
        ...(tags ? { tags } : {}),
      },
    })

    const json = await res.json()

    if (!res.ok) {
      return { data: null, error: json.message || `Error ${res.status}`, success: false }
    }

    return { data: json.data ?? json, error: null, success: true }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('Server Fetch Error:', message)
    return { data: null, error: message, success: false }
  }
}

export async function serverUpload(
  body: FormData
): Promise<{ data: { cover: string | null; images: string[] } | null; error: string | null; success: boolean }> {
  try {
    const cookieJar = await cookies()
    const token = cookieJar.get('token')?.value

    const res = await fetch(`${API_URL}/upload`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: token }),
      },
      body,
    })

    const json = await res.json()

    if (!res.ok) {
      return { data: null, error: json.message || 'Upload failed', success: false }
    }

    return { data: json, error: null, success: true }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Upload failed'
    console.error('Upload Error:', message)
    return { data: null, error: message, success: false }
  }
}

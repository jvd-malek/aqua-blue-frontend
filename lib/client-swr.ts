'use client'

import { notify } from '@/utils'
import useSWR, { SWRConfiguration } from 'swr'
import useSWRMutation from 'swr/mutation'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3815/api'

const baseFetcher = async (url: string) => {
  const res = await fetch(`${API_URL}${url}`, {
    credentials: 'include',
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.message || 'Network error')
  return json
}

export function useGet<T>(
  endpoint: string | null,
  config?: SWRConfiguration
) {
  return useSWR<T>(endpoint, baseFetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 2000,
    keepPreviousData: true,
    ...config,
  })
}

async function mutationFetcher(
  url: string,
  { arg }: { arg: { method: string; body?: Record<string, unknown> } }
) {
  const res = await fetch(`${API_URL}${url}`, {
    method: arg.method,
    headers: { 'Content-Type': 'application/json' },
    body: arg.body ? JSON.stringify(arg.body) : undefined,
    credentials: 'include',
  })
  const json = await res.json()
  if (!res.ok) {
    notify(json.message, 'error')
    throw new Error(json.message || 'Network error')
  }
  return json
}

export function useMutation(endpoint: string) {
  const { trigger, isMutating, error } = useSWRMutation(endpoint, mutationFetcher)

  return {
    post: (body?: Record<string, unknown>) => trigger({ method: 'POST', body }),
    put: (body?: Record<string, unknown>) => trigger({ method: 'PUT', body }),
    del: (body?: Record<string, unknown>) => trigger({ method: 'DELETE', body }),
    isLoading: isMutating,
    error,
  }
}

export async function clientUpload(body: FormData, token?: string) {
  try {
    const res = await fetch(`${API_URL}/upload`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: token }),
      },
      body,
      credentials: 'include',
    })

    const json = await res.json()

    if (!res.ok) {
      return { data: null, error: json.message || 'Upload failed', success: false }
    }

    return { data: json, error: null, success: true }
  } catch (error: unknown) {
    return { data: null, error: error instanceof Error ? error.message : 'Upload failed', success: false }
  }
}

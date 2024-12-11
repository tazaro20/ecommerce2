'use client'
import { cartStore } from '@/lib/hooks/useCartStore'
import useLayoutService from '@/lib/hooks/useLayout'
import { useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { SWRConfig } from 'swr'

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode
}) {
  const updateStore = () => {
    cartStore.persist.rehydrate()
  }
  const { theme } = useLayoutService()

  const [selectedTheme, setSelectedTheme] = useState('system')
  useEffect(() => {
    setSelectedTheme(theme)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme])

  useEffect(() => {
    document.addEventListener('visibilitychange', updateStore)
    window.addEventListener('focus', updateStore)
    return () => {
      document.removeEventListener('visibilitychange', updateStore)
      window.removeEventListener('focus', updateStore)
    }
  }, [])
  return (
    <SWRConfig
      value={{
        onError: (error) => {
          toast.error(error.message)
        },
        fetcher: async (resource, init) => {
          const res = await fetch(resource, init)
          if (!res.ok) {
            throw new Error('An error occurred while fetching the data.')
          }
          return res.json()
        },
      }}
    >
      <Toaster toastOptions={{ className: 'toaster-con' }} />

      <div data-theme={selectedTheme}>{children}</div>
    </SWRConfig>
  )
}

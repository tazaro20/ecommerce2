import { SessionProvider } from 'next-auth/react'
import { auth } from '@/lib/auth'
import ClientProvider from './ClientProviders'

export default async function Providers({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  return (
    <SessionProvider session={session}>
      <ClientProvider>{children}</ClientProvider>
    </SessionProvider>
  )
}

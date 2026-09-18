import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Header from '@/components/header'

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await currentUser()

  if (!user) redirect('/sign-in')

  return (
    <div className="min-h-screen bg-gray-950">
      <Header user={{ name: user.fullName ?? user.username ?? 'User', email: user.emailAddresses[0]?.emailAddress ?? '', imageUrl: user.imageUrl }} />
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {children}
      </main>
    </div>
  )
}

'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { UserButton } from '@clerk/nextjs'
import { NAV_ITEMS } from '@/lib/constants'

interface HeaderProps {
  user: {
    name: string
    email: string
    imageUrl: string
  }
}

export default function Header({ user }: HeaderProps) {
  const pathname = usePathname()

  return (
    <header className="header sticky top-0 z-50">
      <div className="header-wrapper container mx-auto max-w-7xl">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 cursor-pointer">
          <span className="text-yellow-400 text-xl">📈</span>
          <span className="font-bold text-white text-lg tracking-tight">
            Signalist
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === '/'
                ? pathname === '/'
                : pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-link ${isActive ? 'nav-link-active' : ''}`}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Right: user info + Clerk UserButton */}
        <div className="flex items-center gap-3">
          <span className="hidden md:block text-sm text-gray-400 truncate max-w-[160px]">
            {user.name}
          </span>
          <UserButton
            appearance={{
              elements: {
                avatarBox: 'h-8 w-8',
                userButtonPopoverCard: 'bg-gray-900 border border-gray-800',
                userButtonPopoverActionButton: 'text-gray-300 hover:text-white hover:bg-gray-800',
                userButtonPopoverActionButtonText: 'text-gray-300',
                userButtonPopoverFooter: 'hidden',
              },
            }}
          />
        </div>
      </div>
    </header>
  )
}

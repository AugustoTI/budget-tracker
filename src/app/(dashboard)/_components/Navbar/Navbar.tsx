import { UserButton } from '@clerk/nextjs'

import { Logo } from '~/components/Logo'

import { NavbarItem } from '../NavbarItem'
import { ThemeSwitcherButton } from '../ThemeSwitcherButton'

const items = [
  { label: 'Dashboard', link: '/' },
  { label: 'Transações', link: '/transactions' },
  { label: 'Gerencia', link: '/manage' },
]

export function Navbar() {
  return (
    <>
      <DesktopNavbar />
    </>
  )
}

function DesktopNavbar() {
  return (
    <div className="hidden border-separate border-b bg-background md:block">
      <nav className="container flex items-center justify-between px-8">
        <div className="flex h-20 min-h-16 items-center gap-x-4">
          <Logo />

          <div className="flex h-full">
            {items.map((item) => (
              <NavbarItem key={item.link} {...item} />
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ThemeSwitcherButton />
          <UserButton afterSignOutUrl="/sign-in" />
        </div>
      </nav>
    </div>
  )
}

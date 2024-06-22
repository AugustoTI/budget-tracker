'use client'

import { UserButton } from '@clerk/nextjs'
import React from 'react'

import { Button } from '~/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '~/components/ui/sheet'
import { Icons } from '~/components/icons'
import { Logo, LogoMobile } from '~/components/Logo'

import { NavbarItem } from '../NavbarItem'
import { ThemeSwitcherButton } from '../ThemeSwitcherButton'

const items = [
  { label: 'Dashboard', link: '/' },
  { label: 'Transações', link: '/transactions' },
  { label: 'Gerencia', link: '/manage' },
]

export function MobileNavbar() {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <div className="block border-separate bg-background md:hidden">
      <nav className="container flex items-center justify-between px-5 sm:px-8">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Icons.menu className="size-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full pt-10 md:w-3/4">
            <Logo onClick={() => setIsOpen((prevState) => !prevState)} />
            <div className="flex flex-col gap-1 pt-4">
              {items.map((item) => (
                <NavbarItem
                  key={item.link}
                  {...item}
                  onClick={() => setIsOpen((prevState) => !prevState)}
                />
              ))}
            </div>
          </SheetContent>
        </Sheet>
        <div className="flex h-20 min-h-16 items-center gap-x-4">
          <LogoMobile />
        </div>
        <div className="flex items-center gap-2">
          <ThemeSwitcherButton />
          <UserButton afterSignOutUrl="/sign-in" />
        </div>
      </nav>
    </div>
  )
}

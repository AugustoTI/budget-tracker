import Link from 'next/link'

import { Icons } from '../icons'

interface LogoProps {
  onClick?(): void
}

export function Logo({ onClick }: LogoProps) {
  return (
    <Link href="/" className="flex items-center gap-2" onClick={onClick}>
      <Icons.piggyBank className="stroke size-11 stroke-amber-500 stroke-[1.5]" />
      <p className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-3xl font-bold leading-tight tracking-tighter text-transparent">
        BudgetTracker
      </p>
    </Link>
  )
}

export function LogoMobile({ onClick }: LogoProps) {
  return (
    <Link
      href="/"
      className="flex items-center gap-2 bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-3xl font-bold leading-tight tracking-tighter text-transparent xs:text-xl"
      onClick={onClick}
    >
      BudgetTracker
    </Link>
  )
}

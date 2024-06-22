import { Logo } from '~/components/Logo'

interface AuthLayoutProps {
  children: React.ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="relative flex h-screen w-full flex-col items-center justify-center">
      <Logo />
      <div className="mt-12">{children}</div>
    </div>
  )
}

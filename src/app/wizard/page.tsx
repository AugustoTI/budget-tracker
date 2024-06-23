import { currentUser } from '@clerk/nextjs/server'
import Link from 'next/link'
import { redirect } from 'next/navigation'

import { Button } from '~/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import { Separator } from '~/components/ui/separator'
import { CurrencyBox } from '~/components/CurrencyBox'
import { Logo } from '~/components/Logo'

export default async function WizardPage() {
  const user = await currentUser()
  if (!user) return redirect('sign-in')

  return (
    <div className="container flex max-w-2xl flex-col items-center justify-between gap-4">
      <h1 className="text-center text-3xl xs:text-2xl">
        Bem vindo, <span className="ml-2 font-bold">{user.firstName} 👋</span>
      </h1>
      <h2 className="mt-4 text-center text-base text-muted-foreground xs:mt-2 xs:text-sm">
        Vamos começar configurando suas moeda
      </h2>

      <Separator />

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Moeda</CardTitle>
          <CardDescription>Escolha sua moeda padrão para transações</CardDescription>
        </CardHeader>
        <CardContent>
          <CurrencyBox />
        </CardContent>
      </Card>

      <h3 className="mt-2 text-center text-sm text-muted-foreground xs:text-xs">
        Você pode mudar essas configurações quando quiser
      </h3>

      <Separator />

      <Button className="w-full" asChild>
        <Link href="/">Terminei! Me leve ao painel</Link>
      </Button>

      <div className="mt-8">
        <Logo />
      </div>
    </div>
  )
}

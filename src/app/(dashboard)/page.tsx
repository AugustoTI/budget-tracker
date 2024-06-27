import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

import prisma from '~/lib/prisma'
import { Button } from '~/components/ui/button'

import { CreateTransactionDialog } from './_components/CreateTransactionDialog'

export default async function HomePage() {
  const user = await currentUser()

  if (!user) return redirect('/sign-in')

  const userSettings = await prisma.userSettings.findUnique({
    where: { userId: user.id },
  })

  if (!userSettings) return redirect('/wizard')

  return (
    <div className="h-full bg-background">
      <div className="border-b bg-card">
        <div className="container flex flex-wrap items-center justify-between gap-6 py-8">
          <p className="text-3xl font-bold">É bom te ver {user.firstName}! 👋</p>

          <div className="flex items-center gap-3">
            <CreateTransactionDialog
              trigger={
                <Button
                  variant="outline"
                  className="border-emerald-500 bg-emerald-900 text-white hover:bg-emerald-700 hover:text-white"
                >
                  Nova renda 🤑
                </Button>
              }
              type="income"
            />
            <CreateTransactionDialog
              trigger={
                <Button
                  variant="outline"
                  className="border-rose-500 bg-rose-900 text-white hover:bg-rose-700 hover:text-white"
                >
                  Nova despesa 😤
                </Button>
              }
              type="expense"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

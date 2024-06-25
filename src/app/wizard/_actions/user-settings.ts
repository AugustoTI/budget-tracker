'use server'

import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

import prisma from '~/lib/prisma'
import { UpdateUserCurrencySchema } from '~/lib/validations/settings'

export async function updateUserCurrency(currency: string) {
  const parsedBody = UpdateUserCurrencySchema.safeParse({ currency })

  if (!parsedBody.success) throw parsedBody.error

  const user = await currentUser()

  if (!user) return redirect('/sign-in')

  const userSettings = await prisma.userSettings.update({
    where: { userId: user.id },
    data: { currency },
  })

  return userSettings
}

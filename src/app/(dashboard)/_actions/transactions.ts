'use server'

import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

import prisma from '~/lib/prisma'
import {
  CreateTransactionSchema,
  type CreateTransactionSchemaType,
} from '~/lib/validations/transactions'

export async function createTransaction(data: CreateTransactionSchemaType) {
  const parsedBody = CreateTransactionSchema.safeParse(data)

  if (!parsedBody.success) throw new Error(parsedBody.error.message)

  const user = await currentUser()

  if (!user) return redirect('sign-in')

  const { amount, category, date, type, description } = parsedBody.data

  const categoryRow = await prisma.categories.findFirst({
    where: { userId: user.id, name: category },
  })

  if (!categoryRow) throw new Error('Categoria não encontrada')

  await prisma.$transaction([
    prisma.transactions.create({
      data: {
        userId: user.id,
        amount,
        date,
        type,
        description: description || '',
        category: categoryRow.name,
        categoryIcon: categoryRow.icon,
      },
    }),
    prisma.monthHistory.upsert({
      where: {
        day_month_year_userId: {
          userId: user.id,
          day: date.getUTCDate(),
          month: date.getUTCMonth(),
          year: date.getUTCFullYear(),
        },
      },
      create: {
        userId: user.id,
        day: date.getUTCDate(),
        month: date.getUTCMonth(),
        year: date.getUTCFullYear(),
        expense: type === 'expense' ? amount : 0,
        income: type === 'income' ? amount : 0,
      },
      update: {
        expense: {
          increment: type === 'expense' ? amount : 0,
        },
        income: {
          increment: type === 'income' ? amount : 0,
        },
      },
    }),
    prisma.yearHistory.upsert({
      where: {
        month_year_userId: {
          userId: user.id,
          month: date.getUTCMonth(),
          year: date.getUTCFullYear(),
        },
      },
      create: {
        userId: user.id,
        month: date.getUTCMonth(),
        year: date.getUTCFullYear(),
        expense: type === 'expense' ? amount : 0,
        income: type === 'income' ? amount : 0,
      },
      update: {
        expense: {
          increment: type === 'expense' ? amount : 0,
        },
        income: {
          increment: type === 'income' ? amount : 0,
        },
      },
    }),
  ])
}

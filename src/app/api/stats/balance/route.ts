import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

import prisma from '~/lib/prisma'
import { OverviewQuerySchema } from '~/lib/validations/overview'

export async function GET(req: Request) {
  const user = await currentUser()
  if (!user) return redirect('/sign-in')

  const { searchParams } = new URL(req.url)
  const from = searchParams.get('from')
  const to = searchParams.get('to')

  const queryParams = OverviewQuerySchema.safeParse({ from, to })

  if (!queryParams.success)
    return Response.json(queryParams.error.message, {
      status: 400,
    })

  const stats = await getBalanceStats(user.id, queryParams.data.from, queryParams.data.to)

  return Response.json(stats)
}

export type GetBalanceStatsResponse = Awaited<ReturnType<typeof getBalanceStats>>

async function getBalanceStats(userId: string, dateFrom: Date, dateTo: Date) {
  const totals = await prisma.transactions.groupBy({
    by: ['type'],
    where: {
      userId,
      date: {
        gte: dateFrom,
        lte: dateTo,
      },
    },
    _sum: {
      amount: true,
    },
  })

  return {
    expense: totals.find((total) => total.type === 'expense')?._sum.amount || 0,
    income: totals.find((total) => total.type === 'expense')?._sum.amount || 0,
  }
}

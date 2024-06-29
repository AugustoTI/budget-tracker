'use client'

import { type UserSettings } from '@prisma/client'
import { useQuery } from '@tanstack/react-query'
import CountUp from 'react-countup'
import React, { useMemo } from 'react'

import { DateToUTCDate, GetFormatterForCurrency } from '~/lib/helper'
import { Card } from '~/components/ui/card'
import { Icons } from '~/components/icons'
import { SkeletonWrapper } from '~/components/SkeletonWrapper'
import { GetBalanceStatsResponseType } from '~/app/api/stats/balance/route'

interface StatsCardsProps {
  userSettings: UserSettings
  from: Date
  to: Date
}

export function StatsCards({ userSettings, from, to }: StatsCardsProps) {
  const statsQuery = useQuery<GetBalanceStatsResponseType>({
    queryKey: ['overview', 'stats', from, to],
    async queryFn() {
      const response = await fetch(
        `/api/stats/balance?from=${DateToUTCDate(from)}&to=${DateToUTCDate(to)}`,
      )
      return response.json()
    },
  })

  const formatter = useMemo(() => {
    return GetFormatterForCurrency(userSettings.currency)
  }, [userSettings.currency])

  const income = statsQuery.data?.income || 0
  const expense = statsQuery.data?.expense || 0

  const balance = income - expense

  return (
    <div className="relative flex w-full flex-wrap gap-2 md:flex-nowrap">
      <SkeletonWrapper isLoading={statsQuery.isFetching}>
        <StatCard
          title="Renda"
          value={income}
          formatter={formatter}
          icon={
            <Icons.trendingUp className="size-12 items-center rounded-lg bg-emerald-400/10 p-2 text-emerald-500" />
          }
        />
      </SkeletonWrapper>
      <SkeletonWrapper isLoading={statsQuery.isFetching}>
        <StatCard
          title="Gastos"
          value={expense}
          formatter={formatter}
          icon={
            <Icons.trendingDown className="size-12 items-center rounded-lg bg-red-400/10 p-2 text-red-500" />
          }
        />
      </SkeletonWrapper>
      <SkeletonWrapper isLoading={statsQuery.isFetching}>
        <StatCard
          title="Balança"
          value={balance}
          formatter={formatter}
          icon={
            <Icons.wallet className="size-12 items-center rounded-lg bg-violet-400/10 p-2 text-violet-500" />
          }
        />
      </SkeletonWrapper>
    </div>
  )
}

interface StatCardProps {
  title: string
  icon: React.ReactNode
  formatter: Intl.NumberFormat
  value: number
}

export function StatCard({ title, formatter, icon, value }: StatCardProps) {
  const formatFn = React.useCallback(
    (value: number) => {
      return formatter.format(value)
    },
    [formatter],
  )

  return (
    <Card className="flex h-24 w-full items-center gap-2 p-4">
      {icon}
      <div className="flex flex-col items-start gap-0">
        <p className="text-muted-foreground">{title}</p>
        <CountUp
          preserveValue
          redraw={false}
          end={value}
          decimals={2}
          formattingFn={formatFn}
          className="text-2xl"
        />
      </div>
    </Card>
  )
}

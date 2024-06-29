'use client'

import { type UserSettings } from '@prisma/client'
import { differenceInDays, startOfMonth } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { toast } from 'sonner'
import React from 'react'

import { MAX_DATE_RANGE_DAYS } from '~/lib/constants'
import { useMediaQuery } from '~/hooks/use-media-query'
import { DatePickerWithRange } from '~/components/ui/date-ranger-picker'

import { StatsCards } from '../StatsCards'

interface DateRange {
  from: Date
  to: Date
}

export function Overview({ userSettings }: { userSettings: UserSettings }) {
  const [dataRange, setDataRange] = React.useState<DateRange>({
    from: startOfMonth(new Date()),
    to: new Date(),
  })

  const isMobile = useMediaQuery('(max-width:640px)')

  return (
    <>
      <div className="container flex flex-wrap items-end justify-between gap-2 py-6">
        <h2 className="text-3xl font-bold">Overview</h2>
        <DatePickerWithRange
          localeCalendar={ptBR}
          align={isMobile ? 'center' : 'end'}
          date={dataRange}
          numberOfMonths={isMobile ? 1 : 2}
          onUpdate={(range) => {
            if (!range) return

            if (!range.from) return

            const rangeFinal = range.to || range.from

            if (differenceInDays(rangeFinal, range.from) > MAX_DATE_RANGE_DAYS) {
              toast.error(
                `O intervalo de tempo é muito alto. O limite permitido é de no máximo ${MAX_DATE_RANGE_DAYS} dias!`,
              )
              return
            }

            setDataRange({ from: range.from, to: rangeFinal })
          }}
        />
      </div>
      <div className="container">
        <StatsCards userSettings={userSettings} from={dataRange.from} to={dataRange.to} />
      </div>
    </>
  )
}

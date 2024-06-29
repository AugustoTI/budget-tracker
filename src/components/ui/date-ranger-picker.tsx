'use client'

import { format, type Locale } from 'date-fns'
import { type DateRange, type SelectRangeEventHandler } from 'react-day-picker'
import React from 'react'

import { cn } from '~/lib/utils'
import { Button } from '~/components/ui/button'
import { Calendar } from '~/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover'

import { Icons } from '../icons'

interface DatePickerWithRangeProps {
  onUpdate: SelectRangeEventHandler
  date?: DateRange
  localeCalendar?: Locale
  className?: string
  align?: 'center' | 'end' | 'start'
  numberOfMonths?: number
}

export function DatePickerWithRange({
  onUpdate,
  className,
  localeCalendar,
  date,
  align = 'start',
  numberOfMonths = 2,
}: DatePickerWithRangeProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={'outline'}
            className={cn(
              'w-[300px] justify-start text-left font-normal',
              !date && 'text-muted-foreground',
            )}
          >
            <Icons.calendar className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, 'dd LLL, y')} - {format(date.to, 'dd LLL, y')}
                </>
              ) : (
                format(date.from, 'dd LLL, y')
              )
            ) : (
              <span>Selecione uma data </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align={align}>
          <Calendar
            initialFocus
            locale={localeCalendar}
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={onUpdate}
            numberOfMonths={numberOfMonths}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

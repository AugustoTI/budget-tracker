'use client'

import { type UserSettings } from '@prisma/client'
import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import React from 'react'

import { Currencies, type Currency } from '~/lib/currencies'
import { useMediaQuery } from '~/hooks/use-media-query'
import { Button } from '~/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '~/components/ui/command'
import { Drawer, DrawerContent, DrawerTrigger } from '~/components/ui/drawer'
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover'
import { updateUserCurrency } from '~/app/wizard/_actions/user-settings'

import { SkeletonWrapper } from '../SkeletonWrapper'

export function CurrencyBox() {
  const [open, setOpen] = React.useState(false)
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const [selectedOption, setSelectedOption] = React.useState<Currency | null>(null)

  const userSettings = useQuery<UserSettings>({
    queryKey: ['userSettings'],
    async queryFn() {
      const response = await fetch('/api/user-settings')
      return response.json()
    },
  })

  React.useEffect(() => {
    if (!userSettings.data) return

    const userCurrency = Currencies.find(
      (currency) => currency.value === userSettings.data.currency,
    )

    if (userCurrency) setSelectedOption(userCurrency)
  }, [userSettings.data])

  const mutation = useMutation({
    mutationFn: updateUserCurrency,
    onSuccess(data) {
      toast.success('Moeda atualizada com sucesso 🎉', {
        id: 'update-currency',
      })

      setSelectedOption(
        Currencies.find((currency) => currency.value === data.currency) || null,
      )
    },
    onError(error) {
      console.log(error)
      toast.error('Algo deu errado 😢', {
        id: 'update-currency',
      })
    },
  })

  const selectOption = React.useCallback(
    (currency: Currency | null) => {
      if (!currency) return toast.error('Selecione uma moeda')

      toast.loading('Atualizando moeda...', {
        id: 'update-currency',
      })

      mutation.mutate(currency.value)
    },
    [mutation],
  )

  if (isDesktop) {
    return (
      <SkeletonWrapper isLoading={userSettings.isFetching}>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start"
              disabled={mutation.isPending}
            >
              {selectedOption ? <>{selectedOption.label}</> : <>Escolha a moeda</>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0" align="start">
            <OptionList setOpen={setOpen} setSelectedOption={selectOption} />
          </PopoverContent>
        </Popover>
      </SkeletonWrapper>
    )
  }

  return (
    <SkeletonWrapper isLoading={userSettings.isFetching}>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start"
            disabled={mutation.isPending}
          >
            {selectedOption ? <>{selectedOption.label}</> : <>Escolha a moeda</>}
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <div className="mt-4 border-t">
            <OptionList setOpen={setOpen} setSelectedOption={selectOption} />
          </div>
        </DrawerContent>
      </Drawer>
    </SkeletonWrapper>
  )
}

function OptionList({
  setOpen,
  setSelectedOption,
}: {
  setOpen: (open: boolean) => void
  setSelectedOption: (status: Currency | null) => void
}) {
  return (
    <Command>
      <CommandInput placeholder="Filtre moedas..." />
      <CommandList>
        <CommandEmpty>Nenhum resultado encontrado</CommandEmpty>
        <CommandGroup>
          {Currencies.map((currency) => (
            <CommandItem
              key={currency.value}
              value={currency.value}
              onSelect={(value) => {
                setSelectedOption(
                  Currencies.find((priority) => priority.value === value) || null,
                )
                setOpen(false)
              }}
            >
              {currency.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  )
}

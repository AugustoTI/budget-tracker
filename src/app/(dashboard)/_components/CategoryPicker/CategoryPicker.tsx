'use client'

import { type Categories as Category } from '@prisma/client'
import { useQuery } from '@tanstack/react-query'
import React from 'react'

import { TransactionType } from '~/types/transaction'
import { cn } from '~/lib/utils'
import { Button } from '~/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '~/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover'
import { Icons } from '~/components/icons'

import { CreateCategoryDialog } from '../CreateCategoryDialog'

interface CategoryPickerProps {
  type: TransactionType
  onChange(value: string): void
}

export function CategoryPicker({ type, onChange }: CategoryPickerProps) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState('')

  const categoriesQuery = useQuery<Category[]>({
    queryKey: ['categories', type],
    async queryFn() {
      const response = await fetch(`/api/categories?type=${type}`)
      return response.json()
    },
  })

  const selectedCategory = categoriesQuery.data?.find(
    (category) => category.name === value,
  )

  const successCallback = React.useCallback((category: Category) => {
    setValue(category.name)
    setOpen((prevState) => !prevState)
  }, [])

  React.useEffect(() => {
    if (!value) return
    onChange(value)
  }, [onChange, value])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {selectedCategory ? <CategoryRow category={selectedCategory} /> : 'Selecione'}
          <Icons.chevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command
          onSubmit={(event) => {
            event.preventDefault()
          }}
        >
          <CommandInput placeholder="Buscar categoria..." />
          <CreateCategoryDialog type={type} onSuccessCallback={successCallback} />
          <CommandEmpty>
            <p>Categoria não encontrada</p>
            <p className="text-xs text-muted-foreground">Dica: Crie uma nova categoria</p>
          </CommandEmpty>
          <CommandGroup>
            <CommandList>
              {categoriesQuery.data?.map((category) => (
                <CommandItem
                  key={category.name}
                  onSelect={() => {
                    setValue(category.name)
                    setOpen((prevState) => !prevState)
                  }}
                >
                  <CategoryRow category={category} />
                  <Icons.check
                    className={cn(
                      'ml-2 size-4 opacity-0',
                      value === category.name && 'opacity-100',
                    )}
                  />
                </CommandItem>
              ))}
            </CommandList>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

function CategoryRow({ category }: { category: Category }) {
  return (
    <div className="flex items-center gap-2">
      <span role="img">{category.icon}</span>
      <span>{category.name}</span>
    </div>
  )
}

'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { format } from 'date-fns'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import React, { ReactNode } from 'react'

import { type TransactionType } from '~/types/transaction'
import { DateToUTCDate } from '~/lib/helper'
import { cn } from '~/lib/utils'
import {
  CreateTransactionSchema,
  type CreateTransactionSchemaType,
} from '~/lib/validations/transactions'
import { Button } from '~/components/ui/button'
import { Calendar } from '~/components/ui/calendar'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover'
import { Icons } from '~/components/icons'

import { createTransaction } from '../../_actions/transactions'
import { CategoryPicker } from '../CategoryPicker'

interface CreateTransactionDialogProps {
  trigger: ReactNode
  type: TransactionType
}

export function CreateTransactionDialog({ trigger, type }: CreateTransactionDialogProps) {
  const [open, setOpen] = React.useState(false)

  const form = useForm<CreateTransactionSchemaType>({
    resolver: zodResolver(CreateTransactionSchema),
    defaultValues: { type, date: new Date(), description: '', category: '', amount: 0 },
  })

  const handleCategoryChange = React.useCallback(
    (value: string) => {
      form.setValue('category', value)
    },
    [form],
  )

  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: createTransaction,
    onSuccess() {
      toast.success('Transação criada com sucesso! 🎉', {
        id: 'create-transaction',
      })
      form.reset()

      queryClient.invalidateQueries({
        queryKey: ['overview'],
      })

      setOpen((prevState) => !prevState)
    },
    onError() {
      toast.error(`Algo deu errado 😢`, {
        id: 'create-transaction',
      })
    },
  })

  const onSubmit = React.useCallback(
    (values: CreateTransactionSchemaType) => {
      toast.loading('Criando transação...', {
        id: 'create-transaction',
      })

      mutation.mutate({
        ...values,
        date: DateToUTCDate(values.date),
      })
    },
    [mutation],
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Criar nova transação de
            <span
              className={cn(
                'm-1',
                type === 'income' ? 'text-emerald-500' : 'text-rose-500',
              )}
            >
              {type === 'income' ? <>renda</> : <>despesa</>}
            </span>
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    Descrição curta da transação (opcional)
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantia</FormLabel>
                  <FormControl>
                    <Input min={0} type="number" {...field} />
                  </FormControl>
                  <FormDescription>Valor da transação</FormDescription>
                </FormItem>
              )}
            />

            <div className="flex flex-col items-center justify-between gap-2 space-y-4 sm:flex-row sm:space-y-0">
              <FormField
                control={form.control}
                name="category"
                render={() => (
                  <FormItem className="flex w-full flex-col">
                    <FormLabel>Categoria</FormLabel>
                    <CategoryPicker type={type} onChange={handleCategoryChange} />
                    <FormDescription>
                      Selecione uma categoria para essa transação
                    </FormDescription>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex w-full flex-col">
                    <FormLabel>Data da transação</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              'w-full p-3 text-left font-normal sm:w-[200px]',
                              !field.value && 'text-muted-foreground',
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'PPP')
                            ) : (
                              <span>Escolha uma data</span>
                            )}
                            <Icons.calendar className="ml-auto size-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(value) => {
                            if (!value) return
                            field.onChange(value)
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      Selecione uma data para essa transação
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
        <DialogFooter className="gap-y-2">
          <DialogClose asChild>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                form.reset()
              }}
            >
              Cancelar
            </Button>
          </DialogClose>
          <Button onClick={form.handleSubmit(onSubmit)} disabled={mutation.isPending}>
            {!mutation.isPending && 'Criar'}
            {mutation.isPending && <Icons.loading className="animate-spin" />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

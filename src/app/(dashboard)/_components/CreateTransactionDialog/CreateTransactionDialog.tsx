'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import React, { ReactNode } from 'react'

import { type TransactionType } from '~/types/transaction'
import { cn } from '~/lib/utils'
import {
  CreateTransactionSchema,
  type CreateTransactionSchemaType,
} from '~/lib/validations/transactions'
import {
  Dialog,
  DialogContent,
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
} from '~/components/ui/form'
import { Input } from '~/components/ui/input'

import { CategoryPicker } from '../CategoryPicker'

interface CreateTransactionDialogProps {
  trigger: ReactNode
  type: TransactionType
}

export function CreateTransactionDialog({ trigger, type }: CreateTransactionDialogProps) {
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

  return (
    <Dialog>
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
          <form className="space-y-4">
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

            <div className="flex items-center justify-between gap-2">
              <FormField
                control={form.control}
                name="category"
                render={() => (
                  <FormItem>
                    <FormLabel>Categoria</FormLabel>
                    <FormControl>
                      <CategoryPicker type={type} onChange={handleCategoryChange} />
                    </FormControl>
                    <FormDescription>
                      Selecione uma categoria para essa transação
                    </FormDescription>
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

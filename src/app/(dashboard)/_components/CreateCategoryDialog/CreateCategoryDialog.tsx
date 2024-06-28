import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { type Categories as Category } from '@prisma/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTheme } from 'next-themes'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import React from 'react'

import { type TransactionType } from '~/types/transaction'
import { cn } from '~/lib/utils'
import {
  CreateCategorySchema,
  type CreateCategorySchemaType,
} from '~/lib/validations/categories'
import { Button } from '~/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
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
} from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover'
import { Icons } from '~/components/icons'

import { createCategory } from '../../_actions/categories'

interface CreateCategoryDialogProps {
  type: TransactionType
  onSuccessCallback(category: Category): void
}

export function CreateCategoryDialog({
  type,
  onSuccessCallback,
}: CreateCategoryDialogProps) {
  const [open, setOpen] = React.useState(false)
  const form = useForm<CreateCategorySchemaType>({
    resolver: zodResolver(CreateCategorySchema),
    defaultValues: {
      name: '',
      icon: '',
      type,
    },
  })

  const queryClient = useQueryClient()
  const theme = useTheme()

  const mutation = useMutation({
    mutationFn: createCategory,
    async onSuccess(data) {
      form.reset()
      toast.success(`Categoria ${data.name} criada com sucesso! 🎉`, {
        id: 'create-category',
      })

      await queryClient.invalidateQueries({
        queryKey: ['categories'],
      })

      onSuccessCallback(data)

      setOpen((prevState) => !prevState)
    },
    onError() {
      toast.error(`Algo deu errado 😢`, {
        id: 'create-category',
      })
    },
  })

  const onSubmit = React.useCallback(
    (values: CreateCategorySchemaType) => {
      toast.loading('Criando categoria...', {
        id: 'create-category',
      })
      mutation.mutate(values)
    },
    [mutation],
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="flex border-separate items-center justify-start gap-2 rounded-none border-b px-3 py-3 text-muted-foreground"
        >
          <Icons.plusSquare className="size-4" />
          Criar nova
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Criar uma categoria de
            <span
              className={cn(
                'm-1',
                type === 'income' ? 'text-emerald-500' : 'text-rose-500',
              )}
            >
              {type === 'income' ? <>renda</> : <>despesa</>}
            </span>
          </DialogTitle>
          <DialogDescription>
            Categorias são usadas para agrupar suas transações
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    Isto é como sua categoria irá ser mostrada no App
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Icone</FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="h-[100px] w-full">
                          {form.watch('icon') ? (
                            <div className="flex flex-col items-center gap-2">
                              <span className="text-5xl" role="img">
                                {field.value}
                              </span>
                              <p className="text-xs text-muted-foreground">
                                Clique para mudar
                              </p>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center gap-2">
                              <Icons.circleOff className="size-12" />
                              <p className="text-xs text-muted-foreground">
                                Clique para selecionar
                              </p>
                            </div>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full">
                        <Picker
                          data={data}
                          locale="pt"
                          theme={theme.resolvedTheme}
                          onEmojiSelect={(emoji: { native: string }) => {
                            field.onChange(emoji.native)
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormDescription>
                    Isto é como sua categoria irá ser mostrada no App
                  </FormDescription>
                </FormItem>
              )}
            />
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

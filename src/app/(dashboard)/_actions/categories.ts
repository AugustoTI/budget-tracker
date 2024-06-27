'use server'

import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

import prisma from '~/lib/prisma'
import {
  CreateCategorySchema,
  type CreateCategorySchemaType,
} from '~/lib/validations/categories'

export async function createCategory(data: CreateCategorySchemaType) {
  const parsedBody = CreateCategorySchema.safeParse(data)
  if (!parsedBody.success) throw new Error('Dados inválidos')

  const user = await currentUser()
  if (!user) return redirect('/sign-in')

  const { name, icon, type } = parsedBody.data

  return await prisma.categories.create({
    data: { userId: user.id, name, icon, type },
  })
}

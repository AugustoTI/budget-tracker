import { PrismaClient } from '@prisma/client'

import { env } from '~/env.mjs'

const prismaClientSingleton = () => {
  return new PrismaClient()
}

declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma

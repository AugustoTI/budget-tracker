import { z } from 'zod'

import { Currencies } from '../currencies'

export const UpdateUserCurrencySchema = z.object({
  currency: z.custom((value) => {
    const found = Currencies.some((currency) => currency.value === value)

    if (!found) throw new Error(`Invalid currency: ${value}`)

    return value
  }),
})

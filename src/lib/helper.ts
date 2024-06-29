import { Currencies } from './currencies'

export function DateToUTCDate(date: Date) {
  return new Date(
    Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getMilliseconds(),
    ),
  )
}

export function GetFormatterForCurrency(currencyProvided: string) {
  const locale = Currencies.find(
    (currency) => currency.value === currencyProvided,
  )?.locale

  return new Intl.NumberFormat(locale, { style: 'currency', currency: currencyProvided })
}

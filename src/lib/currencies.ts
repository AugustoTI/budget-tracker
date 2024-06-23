export const Currencies = [
  { value: 'USD', label: '$ Dolar', locale: 'en-US' },
  { value: 'EUR', label: '€ Euro', locale: 'de-DE' },
  { value: 'JPY', label: '¥ Iene', locale: 'ja-JP' },
  { value: 'GBP', label: '£ Libra', locale: 'en-GB' },
  { value: 'BRL', label: 'R$ Real', locale: 'pt-BR' },
]

export type Currency = (typeof Currencies)[0]

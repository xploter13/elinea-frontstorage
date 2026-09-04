import { persistCartSession } from '../../../utils/elinea'
import type { Cart } from '@elinea/sdk'

export default defineEventHandler((event) => {
  persistCartSession(event)
  const product = getRouterParam(event, 'product')
  if (!product || !/^\d+$/.test(product)) throw createError({ statusCode: 400, statusMessage: 'Produto inválido' })
  return createServerElineaClient(event).cart.removeItem(Number(product))
    .then((cart: Cart) => ({ data: toLegacyCart(cart) }))
    .catch(rethrowElineaError)
})

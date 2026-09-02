export default defineEventHandler((event) => {
  const product = getRouterParam(event, 'product')
  if (!product || !/^\d+$/.test(product)) throw createError({ statusCode: 400, statusMessage: 'Produto inválido' })
  return createServerElineaClient(event).cart.removeItem(Number(product))
    .then(cart => ({ data: toLegacyCart(cart) }))
    .catch(rethrowElineaError)
})

export default defineEventHandler(async (event) => {
  const body = await readBody<{ product_id: number, quantity?: number }>(event)
  try { return { data: toLegacyCart(await createServerElineaClient(event).cart.addItem(body.product_id, body.quantity)) } }
  catch (error) { rethrowElineaError(error) }
})

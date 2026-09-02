export default defineEventHandler(async (event) => {
  try { return { data: toLegacyCart(await createServerElineaClient(event).cart.get()) } }
  catch (error) { rethrowElineaError(error) }
})

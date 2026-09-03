import { persistCartSession } from '../utils/elinea'

export default defineEventHandler(async (event) => {
  persistCartSession(event)
  try { return { data: toLegacyCart(await createServerElineaClient(event).cart.get()) } }
  catch (error) { rethrowElineaError(error) }
})

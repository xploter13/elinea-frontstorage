import { createServerElineaClient, rethrowElineaError } from '../../utils/elinea'

export default defineEventHandler(async (event) => {
  try {
    await createServerElineaClient(event).customer.logout()
  } catch (error) {
    rethrowElineaError(error)
  } finally {
    deleteCookie(event, 'elinea_customer_token', { path: '/' })
  }
  return { success: true }
})

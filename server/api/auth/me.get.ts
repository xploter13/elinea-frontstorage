import { createServerElineaClient, rethrowElineaError } from '../../utils/elinea'

export default defineEventHandler(async (event) => {
  try {
    return { customer: await createServerElineaClient(event).customer.getProfile() }
  } catch (error) {
    rethrowElineaError(error)
  }
})

import { rethrowElineaError, createServerElineaClient } from '../../../utils/elinea'
export default defineEventHandler(async event => { try { return await (createServerElineaClient(event) as any).customer.twoFactor.recoveryCodes() } catch (error) { rethrowElineaError(error) } })

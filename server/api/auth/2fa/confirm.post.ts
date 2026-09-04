import { rethrowElineaError, createServerElineaClient } from '../../../utils/elinea'
export default defineEventHandler(async event => { const body = await readBody<{ code?: string }>(event); try { return await (createServerElineaClient(event) as any).customer.twoFactor.confirm(String(body?.code || '')) } catch (error) { rethrowElineaError(error) } })

import { rethrowElineaError, createServerElineaClient } from '../../../utils/elinea'
export default defineEventHandler(async event => { const body = await readBody<{ password?: string }>(event); try { return await (createServerElineaClient(event) as any).customer.twoFactor.disable(String(body?.password || '')) } catch (error) { rethrowElineaError(error) } })

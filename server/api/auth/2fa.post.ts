import { rethrowElineaError, createServerElineaClient } from '../../utils/elinea'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ code?: string, recovery_code?: string }>(event)
  const token = getCookie(event, 'elinea_customer_2fa_token')
  if (!token || (!body?.code && !body?.recovery_code)) throw createError({ statusCode: 422, message: 'Informe o código de autenticação.' })
  try {
    const session: any = await (createServerElineaClient(event) as any).customer.completeTwoFactorLogin({ twoFactorToken: token, code: body.code, recoveryCode: body.recovery_code })
    setCookie(event, 'elinea_customer_token', session.token, { httpOnly: true, sameSite: 'lax', secure: !import.meta.dev, path: '/', maxAge: 60 * 60 * 24 * 30 })
    deleteCookie(event, 'elinea_customer_2fa_token', { path: '/' })
    return { customer: session.customer }
  } catch (error) { rethrowElineaError(error) }
})

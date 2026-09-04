import { rethrowElineaError, createServerElineaClient } from '../../utils/elinea'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ email?: string, password?: string }>(event)

  if (!body?.email || !body?.password) {
    throw createError({ statusCode: 422, statusMessage: 'E-mail e senha são obrigatórios.' })
  }

  try {
    const session: any = await (createServerElineaClient(event) as any).customer.login({ email: body.email, password: body.password })
    if ('twoFactorRequired' in session) {
      setCookie(event, 'elinea_customer_2fa_token', session.twoFactorToken, { httpOnly: true, sameSite: 'lax', secure: !import.meta.dev, path: '/', maxAge: 300 })
      return { two_factor_required: true, expires_at: session.expiresAt }
    }
    setCookie(event, 'elinea_customer_token', session.token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: !import.meta.dev,
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    })
    return { customer: session.customer }
  } catch (error) {
    rethrowElineaError(error)
  }
})

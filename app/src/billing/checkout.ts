import type { PlanId } from './plans'

/**
 * Chargebee integration boundary.
 *
 * The Chargebee API key is a server secret and never reaches the browser. This
 * module only speaks to a same-origin relative path, so a leaked bundle cannot
 * expose a key, and no `VITE_`-prefixed variable (those are inlined into the
 * client bundle) may hold one.
 *
 * Today this app is a Vite SPA with no server routes, so `startCheckout`
 * below is a stub boundary: it fails with a readable message instead of
 * pretending a purchase happened.
 *
 * ---------------------------------------------------------------------
 * SERVER CONTRACT — POST /api/billing/checkout  (does not exist yet)
 * ---------------------------------------------------------------------
 * Request (JSON):
 *   { missionId: string, planId: string, returnUrl: string }
 *
 * The server must:
 *  1. Identify the caller from the session cookie. Never trust `planId` or any
 *     price field from the client: look the mission up in your own table and
 *     map it to a Chargebee plan / item price id from a server-side allowlist.
 *  2. Return 501 { error } when the env below is missing, so a misconfigured
 *     deploy degrades to "billing unavailable" instead of a stack trace.
 *  3. Create or reuse the customer, then open a hosted checkout page:
 *       chargebee.setApiKey(process.env.CHARGEBEE_API_KEY)
 *       chargebee.setSite(process.env.CHARGEBEE_SITE)
 *       const { customer } = await chargebee.customer.create({
 *         email, first_name, last_name,
 *         billing_agreement: { auto_collection: true },
 *       })
 *       const { hosted_page } = await chargebee.hostedPage.checkoutNew({
 *         subscription: { plan_id: chargebeePlanId, plan_quantity: 1 },
 *         customer: { id: customer.id, email, locale: 'en' },
 *         redirect_url: `${APP_ORIGIN}${returnUrl}?chargebee=success`,
 *         cancel_url: `${APP_ORIGIN}${returnUrl}?chargebee=cancelled`,
 *       })
 *       res.json({ url: hosted_page.url })
 *     (Use `hostedPage.checkoutExisting({ subscription: { id } }, ...)` when the
 *     caller already has an active subscription. If you skip hosted pages
 *     entirely, `subscription.create({ plan_id, customer_id })` is the server
 *     equivalent — it still requires the API key, so it stays server-side.)
 *  4. Respond 200 { url } on success, 4xx/5xx { error: string } otherwise.
 *
 * WEBHOOK — POST /api/billing/webhooks/chargebee  (also does not exist yet)
 *  - Verify the signature over the RAW body with the per-endpoint webhook
 *    secret (Chargebee sends it as `chargebee-webhook-signature`, or as Basic
 *    Auth when the endpoint is configured that way — check your dashboard).
 *    Deduplicate on `event.id`; Chargebee retries.
 *  - Handle `subscription_created`, `subscription_activated`,
 *    `subscription_cancelled`, `subscription_trial_end`, `payment_failed`.
 *    Entitlements are granted here, not from the redirect: read
 *    `content.subscription.customer_id`, map the Chargebee customer to a local
 *    user, and persist `{ userId, missionId }`.
 *
 * The browser is never trusted for price or entitlement. `PLANS.pro
 * .priceMonthly` is `null` until a real number is read back from Chargebee.
 */

/** Server-side env. `.env.example` for the backend, never for the client bundle. */
export const BILLING_SERVER_ENV = {
  apiKey: 'CHARGEBEE_API_KEY',
  site: 'CHARGEBEE_SITE',
  webhookSecret: 'CHARGEBEE_WEBHOOK_SECRET',
} as const

export const CHECKOUT_ENDPOINT = '/api/billing/checkout'

export const NO_BACKEND_MESSAGE =
  'Checkout needs a billing server, and this build has none. Add the /api/billing/checkout route (see src/billing/checkout.ts) before taking payments.'

const TIMEOUT_MS = 10_000

export type CheckoutResult =
  | { ok: true; kind: 'redirect'; url: string }
  | { ok: true; kind: 'unlocked'; missionId: string }
  | { ok: false; kind: 'unavailable'; message: string }
  | { ok: false; kind: 'error'; message: string }

async function readJson(res: Response): Promise<Record<string, unknown> | null> {
  const text = await res.text().catch(() => '')
  if (!text) return null
  try {
    const parsed: unknown = JSON.parse(text)
    return typeof parsed === 'object' && parsed !== null ? (parsed as Record<string, unknown>) : null
  } catch {
    return null
  }
}

const stringField = (body: Record<string, unknown> | null, ...keys: string[]): string | null => {
  for (const key of keys) {
    const value = body?.[key]
    if (typeof value === 'string' && value) return value
  }
  return null
}

/**
 * Opens checkout for one mission. Never throws and never resolves to success
 * without a real Chargebee URL — every failure mode is a value the UI can show.
 */
export async function startCheckout(missionId: string, planId: PlanId = 'pro'): Promise<CheckoutResult> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)

  let res: Response
  try {
    res = await fetch(CHECKOUT_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({
        missionId,
        planId,
        returnUrl: `${window.location.origin}${window.location.pathname}`,
      }),
      signal: controller.signal,
    })
  } catch (error) {
    const aborted = error instanceof DOMException && error.name === 'AbortError'
    return {
      ok: false,
      kind: 'unavailable',
      message: aborted
        ? `The billing server did not answer within ${TIMEOUT_MS / 1000}s.`
        : NO_BACKEND_MESSAGE,
    }
  } finally {
    clearTimeout(timer)
  }

  const body = await readJson(res)

  // No route, or a dev server answering with HTML: nothing to charge through.
  if (!res.ok && (res.status === 404 || res.status === 405 || res.status === 501 || body === null)) {
    return {
      ok: false,
      kind: 'unavailable',
      message: stringField(body, 'error', 'message') ?? NO_BACKEND_MESSAGE,
    }
  }

  if (!res.ok) {
    return {
      ok: false,
      kind: 'error',
      message: stringField(body, 'error', 'message') ?? `Checkout failed (HTTP ${res.status}).`,
    }
  }

  const url = stringField(body, 'url', 'checkoutUrl', 'hosted_page_url')
  if (url) return { ok: true, kind: 'redirect', url }

  // Sandbox flows and already-paid retries can grant without a redirect.
  const unlockedMissionId = stringField(body, 'unlockedMissionId')
  if (unlockedMissionId) return { ok: true, kind: 'unlocked', missionId: unlockedMissionId }

  return {
    ok: false,
    kind: 'unavailable',
    message: 'The billing server replied without a Chargebee checkout URL.',
  }
}
/**
 * AngelOne SmartAPI Client
 * Server-side only — never import from client components.
 *
 * Auth flow:
 *  1. Reads ANGEL_API_KEY, ANGEL_CLIENT_ID, ANGEL_MPIN, ANGEL_TOTP_SECRET from env.
 *  2. Auto-generates a TOTP from the base32 secret (no manual entry needed).
 *  3. Exchanges credentials for a JWT token + refreshToken.
 *  4. Caches the session in-memory; re-authenticates on expiry (midnight reset).
 *
 * Docs: https://smartapi.angelone.in/
 */

import * as OTPAuth from 'otpauth'

const BASE = 'https://apiconnect.angelone.in'

// -- Types ----------------------------------------------------------------------

export interface AngelSession {
  jwtToken: string
  refreshToken: string
  feedToken: string
  expiresAt: number // unix ms
}

export interface Holding {
  tradingsymbol: string
  exchange: string
  isin: string
  t1quantity: number
  realisedquantity: number
  quantity: number
  authorisedquantity: number
  product: string
  collateralquantity: number | null
  collateraltype: string | null
  haircut: number
  averageprice: number
  ltp: number
  symboltoken: string
  close: number
  profitandloss: number
  pnlpercentage: number
}

export interface Position {
  symbolname: string
  tradingsymbol: string
  exchange: string
  symboltoken: string
  producttype: string
  buyqty: number
  sellqty: number
  buyamount: number
  sellamount: number
  netqty: number
  ltp: number
  close: number
  realised: number
  unrealised: number
  pnl: number
}

export interface LTPData {
  exchange: string
  tradingsymbol: string
  symboltoken: string
  open: number
  high: number
  low: number
  close: number
  ltp: number
}

export interface HoldingsResponse {
  holdings: Holding[]
  totalholding: {
    totalholdingvalue: number
    totalinvvalue: number
    totalprofitandloss: number
    totalpnlpercentage: number
  }
}

// -- Session Cache --------------------------------------------------------------

let _session: AngelSession | null = null

/** Returns true if the cached session is still valid (with a 5-min buffer). */
function isSessionValid(): boolean {
  if (!_session) return false
  return Date.now() < _session.expiresAt - 5 * 60 * 1000
}

/** Generates a TOTP code from the base32 secret in env. */
function generateTOTP(): string {
  const secret = process.env.ANGEL_TOTP_SECRET
  if (!secret) throw new Error('ANGEL_TOTP_SECRET is not set in environment')

  const totp = new OTPAuth.TOTP({
    secret: OTPAuth.Secret.fromBase32(secret),
    algorithm: 'SHA1',
    digits: 6,
    period: 30,
  })
  return totp.generate()
}

/** End of today at midnight (IST-aware: AngelOne sessions reset at midnight IST). */
function getSessionExpiry(): number {
  const now = new Date()
  // sessions expire at midnight IST (UTC+5:30)
  const midnight = new Date(now)
  midnight.setHours(23, 55, 0, 0) // expire slightly before midnight for safety
  if (midnight.getTime() < now.getTime()) {
    midnight.setDate(midnight.getDate() + 1)
  }
  return midnight.getTime()
}

// -- Auth -----------------------------------------------------------------------

/**
 * Authenticates with AngelOne and stores the session.
 * Called automatically by getSession(); you rarely need to call this directly.
 */
export async function login(): Promise<AngelSession> {
  const apiKey = process.env.ANGEL_API_KEY
  const clientcode = process.env.ANGEL_CLIENT_ID
  const password = process.env.ANGEL_MPIN

  if (!apiKey || !clientcode || !password) {
    throw new Error(
      'AngelOne credentials missing. Set ANGEL_API_KEY, ANGEL_CLIENT_ID, ANGEL_MPIN in your .env.local'
    )
  }

  const totp = generateTOTP()

  const res = await fetch(
    `${BASE}/rest/auth/angelbroking/user/v1/loginByPassword`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-UserType': 'USER',
        'X-SourceID': 'WEB',
        'X-ClientLocalIP': '127.0.0.1',
        'X-ClientPublicIP': '127.0.0.1',
        'X-MACAddress': '00:00:00:00:00:00',
        'X-PrivateKey': apiKey,
      },
      body: JSON.stringify({ clientcode, password, totp }),
    }
  )

  const json = await res.json()

  if (!json.status || !json.data?.jwtToken) {
    throw new Error(
      `AngelOne login failed: ${json.message ?? JSON.stringify(json)}`
    )
  }

  _session = {
    jwtToken: json.data.jwtToken,
    refreshToken: json.data.refreshToken,
    feedToken: json.data.feedToken,
    expiresAt: getSessionExpiry(),
  }

  return _session
}

/** Returns a valid AngelOne session, re-authenticating if needed. */
export async function getSession(): Promise<AngelSession> {
  if (isSessionValid()) return _session!
  return login()
}

// -- Helpers -------------------------------------------------------------------

async function angelFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const session = await getSession()
  const apiKey = process.env.ANGEL_API_KEY!

  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${session.jwtToken}`,
      'X-UserType': 'USER',
      'X-SourceID': 'WEB',
      'X-ClientLocalIP': '127.0.0.1',
      'X-ClientPublicIP': '127.0.0.1',
      'X-MACAddress': '00:00:00:00:00:00',
      'X-PrivateKey': apiKey,
      ...(options.headers ?? {}),
    },
  })

  const json = await res.json()

  if (!json.status) {
    // If token expired mid-session, invalidate cache and retry once
    if (json.errorcode === 'AB1010' || json.errorcode === 'AB1011') {
      _session = null
      return angelFetch<T>(path, options)
    }
    throw new Error(`AngelOne API error [${path}]: ${json.message}`)
  }

  return json.data as T
}

// -- Public API -----------------------------------------------------------------

/**
 * Fetches all holdings in the Demat account.
 */
export async function getHoldings(): Promise<HoldingsResponse> {
  return angelFetch<HoldingsResponse>(
    '/rest/secure/angelbroking/portfolio/v1/getAllHolding'
  )
}

/**
 * Fetches current open positions (intraday + carryforward).
 */
export async function getPositions(): Promise<Position[]> {
  return angelFetch<Position[]>(
    '/rest/secure/angelbroking/order/v1/getPosition'
  )
}

/**
 * Fetches LTP (Last Traded Price) for up to 50 symbols in one call.
 *
 * @param exchangeTokens - e.g. { "NSE": ["3045", "1594"] }
 */
export async function getLTP(
  exchangeTokens: Record<string, string[]>
): Promise<LTPData[]> {
  return angelFetch<LTPData[]>(
    '/rest/secure/angelbroking/market/v1/quote/',
    {
      method: 'POST',
      body: JSON.stringify({
        mode: 'LTP',
        exchangeTokens,
      }),
    }
  )
}

/**
 * Searches for a stock symbol on AngelOne.
 */
export async function searchSymbolAngel(query: string) {
  return angelFetch<{ symboltoken: string; tradingsymbol: string; exchange: string; name: string }[]>(
    `/rest/secure/angelbroking/order/v1/searchScrip`,
    {
      method: 'POST',
      body: JSON.stringify({ exchange: 'NSE', searchscrip: query }),
    }
  )
}

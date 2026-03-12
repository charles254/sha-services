/**
 * SHA Online Services — M-Pesa Daraja Library
 * Adapted from the KRA project. Supports sandbox & production modes.
 */

const MPESA_ENV = process.env.MPESA_ENV || 'sandbox';
const BASE_URL  = MPESA_ENV === 'production'
  ? 'https://api.safaricom.co.ke'
  : 'https://sandbox.safaricom.co.ke';

const SHORTCODE       = process.env.MPESA_SHORTCODE || '174379';
const PASSKEY         = process.env.MPESA_PASSKEY   || 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919';
const CALLBACK_URL    = process.env.MPESA_CALLBACK_URL || 'https://your-domain.co.ke/api/mpesa/callback';
const CONSUMER_KEY    = process.env.MPESA_CONSUMER_KEY    || '';
const CONSUMER_SECRET = process.env.MPESA_CONSUMER_SECRET || '';

/** Format phone number to 254XXXXXXXXX */
function formatPhone(phone: string): string {
  let p = phone.replace(/[^0-9]/g, '');
  if (p.startsWith('0'))   p = '254' + p.slice(1);
  if (!p.startsWith('254')) p = '254' + p;
  return p;
}

/** Get OAuth access token from Daraja */
export async function generateToken(): Promise<string> {
  const isMock = !CONSUMER_KEY || CONSUMER_KEY.includes('your_') ||
                 !CONSUMER_SECRET || CONSUMER_SECRET.includes('your_');

  if (isMock) {
    console.log('[mpesa] No credentials — returning mock token (sandbox demo mode)');
    return 'mock-token';
  }

  const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64');

  const res = await fetch(`${BASE_URL}/oauth/v1/generate?grant_type=client_credentials`, {
    headers: { Authorization: `Basic ${auth}` },
    cache: 'no-store',
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`[mpesa] Token fetch failed: ${text}`);
  }

  const data = await res.json();
  return data.access_token as string;
}

/** Initiate STK Push (Lipa Na M-Pesa Online) */
export async function initiateSTKPush(
  phone: string,
  amount: number,
  orderId: string,
  serviceName = 'SHA Online Service'
): Promise<{ success: boolean; checkoutRequestId?: string; customerMessage?: string; error?: string }> {
  const formattedPhone = formatPhone(phone);
  const timestamp      = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
  const password       = Buffer.from(`${SHORTCODE}${PASSKEY}${timestamp}`).toString('base64');
  const accountRef     = orderId.slice(0, 12).replace(/[^a-zA-Z0-9]/g, '');

  try {
    const token = await generateToken();

    // Sandbox / mock mode — simulate a successful push
    if (token === 'mock-token') {
      console.log(`[mpesa] Sandbox STK Push → ${formattedPhone} | Ksh ${amount} | Order ${orderId}`);
      return {
        success:           true,
        checkoutRequestId: `ws_CO_${Date.now()}`,
        customerMessage:   'Sandbox mode: payment will be auto-confirmed in a few seconds.',
      };
    }

    const res = await fetch(`${BASE_URL}/mpesa/stkpush/v1/processrequest`, {
      method: 'POST',
      headers: {
        Authorization:  `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        BusinessShortCode: SHORTCODE,
        Password:          password,
        Timestamp:         timestamp,
        TransactionType:   'CustomerPayBillOnline',
        Amount:            Math.round(amount),
        PartyA:            formattedPhone,
        PartyB:            SHORTCODE,
        PhoneNumber:       formattedPhone,
        CallBackURL:       CALLBACK_URL,
        AccountReference:  accountRef,
        TransactionDesc:   `SHA-${serviceName.slice(0, 20)}`,
      }),
      cache: 'no-store',
    });

    const data = await res.json();

    if (!res.ok || data.ResponseCode !== '0') {
      return { success: false, error: data.errorMessage || data.ResultDesc || 'STK Push rejected' };
    }

    return {
      success:           true,
      checkoutRequestId: data.CheckoutRequestID,
      customerMessage:   data.CustomerMessage,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    console.error('[mpesa] STK Push error:', msg);
    return { success: false, error: msg };
  }
}

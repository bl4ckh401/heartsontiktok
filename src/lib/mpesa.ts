
import axios from 'axios';
import db from '@/lib/firebase-admin';

const MPESA_BASE_URL = 'https://api.safaricom.co.ke';
const MPESA_CONSUMER_KEY = process.env.MPESA_CONSUMER_KEY;
const MPESA_CONSUMER_SECRET = process.env.MPESA_CONSUMER_SECRET;
const MPESA_B2C_SHORTCODE = process.env.MPESA_B2C_SHORTCODE;
const MPESA_B2C_INITIATOR_NAME = process.env.MPESA_B2C_INITIATOR_NAME;
const MPESA_B2C_RESULT_URL = `${process.env.APP_URL}/api/payouts/callback/result`;
const MPESA_B2C_QUEUE_TIMEOUT_URL = `${process.env.APP_URL}/api/payouts/callback/timeout`;
const MPESA_C2B_SHORTCODE = process.env.MPESA_C2B_SHORTCODE;
const MPESA_C2B_CALLBACK_URL = `${process.env.APP_URL}/api/subscribe/callback`;
const MPESA_PASSKEY = process.env.MPESA_PASSKEY;

/**
 * Generates an M-Pesa OAuth2 Access Token.
 * Caches the token in Firestore to avoid redundant requests.
 */
export async function getMpesaToken(): Promise<string> {
  const tokenRef = db.firestore().collection('internal_state').doc('mpesa_token');
  const tokenDoc = await tokenRef.get();

  if (tokenDoc.exists) {
    const data = tokenDoc.data();
    const expiresAt = data?.expiresAt || 0;
    if (Date.now() < expiresAt) {
      return data?.accessToken;
    }
  }

  if (!MPESA_CONSUMER_KEY || !MPESA_CONSUMER_SECRET) {
    throw new Error('M-Pesa consumer key or secret is not configured in environment variables.');
  }

  const credentials = Buffer.from(`${MPESA_CONSUMER_KEY}:${MPESA_CONSUMER_SECRET}`).toString('base64');
  
  try {
    const response = await axios.get(`${MPESA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`, {
      headers: {
        'Authorization': `Basic ${credentials}`,
      },
    });

    const { access_token, expires_in } = response.data;
    
    // Cache the token with an expiry time slightly less than the actual expiry to be safe
    const newExpiresAt = Date.now() + (parseInt(expires_in, 10) - 300) * 1000;
    await tokenRef.set({
      accessToken: access_token,
      expiresAt: newExpiresAt,
    });

    return access_token;
  } catch (error: any) {
    console.error('Error fetching M-Pesa token:', error.response?.data || error.message);
    throw new Error('Failed to generate M-Pesa access token.');
  }
}

async function getSecurityCredential(): Promise<string> {
    // In a real production environment, this should be an encrypted password.
    // For sandbox, this is often a plaintext credential provided by Safaricom.
    // IMPORTANT: You must generate this using the "Security Credential" tool on the Daraja portal and place the result in your .env file
    const securityCredential = process.env.MPESA_SECURITY_CREDENTIAL;
    if (!securityCredential) {
        throw new Error('MPESA_SECURITY_CREDENTIAL is not set in environment variables. Please generate one from the Daraja portal.');
    }
    return securityCredential;
}

/**
 * Initiates a Business-to-Customer (B2C) Payout.
 */
export async function initiateB2CPayout(
  token: string,
  amount: number,
  phoneNumber: string,
  remarks: string
): Promise<any> {

  const securityCredential = await getSecurityCredential();
  const payload = {
    InitiatorName: MPESA_B2C_INITIATOR_NAME,
    SecurityCredential: securityCredential,
    CommandID: 'BusinessPayment',
    Amount: amount,
    PartyA: MPESA_B2C_SHORTCODE,
    PartyB: phoneNumber,
    Remarks: remarks,
    QueueTimeOutURL: MPESA_B2C_QUEUE_TIMEOUT_URL,
    ResultURL: MPESA_B2C_RESULT_URL,
    Occasion: 'CreatorPayout'
  };

  try {
    const response = await axios.post(
      `${MPESA_BASE_URL}/mpesa/b2c/v1/paymentrequest`,
      payload,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error('M-Pesa B2C API Error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.errorMessage || 'Failed to initiate M-Pesa payout.');
  }
}

/**
 * Initiates an M-Pesa STK Push for C2B payments (e.g., subscriptions).
 */
export async function initiateSTKPush(
    token: string,
    phoneNumber: string,
    amount: number,
    accountReference: string,
    transactionDesc: string
): Promise<any> {

    const shortCode = MPESA_C2B_SHORTCODE;
    const passkey = MPESA_PASSKEY;
    if (!shortCode || !passkey) {
        throw new Error("M-Pesa C2B Shortcode or Passkey is not configured.");
    }

    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
    const password = Buffer.from(`${shortCode}${passkey}${timestamp}`).toString('base64');
    
    const payload = {
        BusinessShortCode: shortCode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline", // or "CustomerBuyGoodsOnline"
        Amount: amount,
        PartyA: phoneNumber,
        PartyB: shortCode,
        PhoneNumber: phoneNumber,
        CallBackURL: MPESA_C2B_CALLBACK_URL,
        AccountReference: accountReference,
        TransactionDesc: transactionDesc
    };

    try {
        const response = await axios.post(
            `${MPESA_BASE_URL}/mpesa/stkpush/v1/processrequest`,
            payload,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        return response.data;
    } catch (error: any) {
        console.error('M-Pesa STK Push API Error:', error.response?.data || error.message);
        throw new Error(error.response?.data?.errorMessage || 'Failed to initiate M-Pesa STK Push.');
    }
}

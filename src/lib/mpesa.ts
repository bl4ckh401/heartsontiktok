
import axios from 'axios';
import db from '@/lib/firebase-admin';

const MPESA_BASE_URL = 'https://sandbox.safaricom.co.ke';
const MPESA_CONSUMER_KEY = process.env.MPESA_CONSUMER_KEY;
const MPESA_CONSUMER_SECRET = process.env.MPESA_CONSUMER_SECRET;
const MPESA_B2C_SHORTCODE = process.env.MPESA_B2C_SHORTCODE;
const MPESA_B2C_INITIATOR_NAME = process.env.MPESA_B2C_INITIATOR_NAME;
const MPESA_B2C_INITIATOR_PASSWORD = process.env.MPESA_B2C_INITIATOR_PASSWORD; // This needs to be encrypted
const MPESA_B2C_RESULT_URL = process.env.MPESA_B2C_RESULT_URL;
const MPESA_B2C_QUEUE_TIMEOUT_URL = process.env.MPESA_B2C_QUEUE_TIMEOUT_URL;

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

  // If token doesn't exist or is expired, fetch a new one
  const credentials = Buffer.from(`${MPESA_CONSUMER_KEY}:${MPESA_CONSUMER_SECRET}`).toString('base64');
  
  const response = await axios.get(`${MPESA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`, {
    headers: {
      'Authorization': `Basic ${credentials}`,
    },
  });

  const { access_token, expires_in } = response.data;
  
  // Cache the new token in Firestore
  const newExpiresAt = Date.now() + (parseInt(expires_in, 10) - 300) * 1000; // Subtract 5 mins for safety
  await tokenRef.set({
    accessToken: access_token,
    expiresAt: newExpiresAt,
  });

  return access_token;
}

// In a real production environment, this should be done on a secure server.
// The SecurityCredential is an encrypted version of the Initiator Password.
// Safaricom provides a guide on how to encrypt this. For sandbox, you can use a test credential.
async function getSecurityCredential(): Promise<string> {
    // For sandbox, you might get a pre-encrypted credential.
    // For production, you must encrypt the initiator password using the provided certificate.
    // This is a placeholder. Replace with actual encryption logic.
    return process.env.MPESA_SECURITY_CREDENTIAL || 'YOUR_ENCRYPTED_CREDENTIAL';
}


/**
 * Initiates a Business-to-Customer (B2C) Payout.
 * @param token - M-Pesa Access Token
 * @param amount - The amount to pay out (integer)
 * @param phoneNumber - The recipient's phone number (e.g., 2547...)
 * @param remarks - A short description of the transaction
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
    CommandID: 'BusinessPayment', // Command ID for B2C payouts
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

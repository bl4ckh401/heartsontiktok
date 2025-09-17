import axios from 'axios';
import db from '@/lib/firebase-admin';

const SWAPUZI_BASE_URL = process.env.SWAPUZI_BASE_URL || 'https://merchantsapi.swapuzi.com';
const SWAPUZI_USERNAME = process.env.SWAPUZI_USERNAME;
const SWAPUZI_PASSWORD = process.env.SWAPUZI_PASSWORD;
const SWAPUZI_MERCHANT_ID = process.env.SWAPUZI_MERCHANT_ID;

interface SwapuziTokenResponse {
  token: string;
  expiresAt: number;
}

/**
 * Generate Bearer Token for Swapuzi API
 */
export async function getSwapuziToken(): Promise<string> {
  const tokenRef = db.firestore().collection('internal_state').doc('swapuzi_token');
  const tokenDoc = await tokenRef.get();

  if (tokenDoc.exists) {
    const data = tokenDoc.data();
    const expiresAt = data?.expiresAt || 0;
    if (Date.now() < expiresAt) {
      return data?.token;
    }
  }

  if (!SWAPUZI_USERNAME || !SWAPUZI_PASSWORD) {
    throw new Error('Swapuzi credentials not configured');
  }

  try {
    const response = await axios.get(`${SWAPUZI_BASE_URL}/api/v1`, {
      auth: {
        username: SWAPUZI_USERNAME,
        password: SWAPUZI_PASSWORD,
      },
    });

    // The token is returned in the Authorization header
    const authHeader = response.headers['authorization'];
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : authHeader;
    
    if (!token) {
      console.error('Token response:', { headers: response.headers, data: response.data });
      throw new Error('No token received from Swapuzi API');
    }

    // Cache token for 1 hour (adjust based on actual expiry)
    const expiresAt = Date.now() + (3600 * 1000);
    await tokenRef.set({ token, expiresAt });

    return token;
  } catch (error: any) {
    console.error('Swapuzi token error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      config: {
        url: error.config?.url,
        auth: error.config?.auth ? 'configured' : 'missing'
      }
    });
    throw new Error('Failed to get Swapuzi token');
  }
}

/**
 * Initiate B2C Transfer (Send to Mobile)
 */
export async function initiateB2CTransfer(
  amount: number,
  phoneNumber: string,
  externalId: string,
  callbackUrl: string
): Promise<any> {
  const token = await getSwapuziToken();
  
  const payload = {
    impalaMerchantId: SWAPUZI_MERCHANT_ID,
    currency: 'KES',
    amount,
    recipientPhone: phoneNumber,
    mobileMoneySP: 'M-Pesa',
    externalId,
    callbackUrl,
  };

  try {
    const response = await axios.post(
      `${SWAPUZI_BASE_URL}/api/v1/mobile/transfer`,
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
    console.error('Swapuzi B2C error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'B2C transfer failed');
  }
}

/**
 * Check payout balance
 */
export async function getPayoutBalance(): Promise<any> {
  const token = await getSwapuziToken();
  
  try {
    const response = await axios.get(
      `${SWAPUZI_BASE_URL}/api/v1/read/payouts/balance`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error('Balance check error:', error.response?.data || error.message);
    throw new Error('Failed to check balance');
  }
}
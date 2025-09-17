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
    console.log('Getting Swapuzi token with credentials:', { username: SWAPUZI_USERNAME, merchantId: SWAPUZI_MERCHANT_ID });
    
    const response = await fetch(`${SWAPUZI_BASE_URL}/api/v1`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${btoa(`${SWAPUZI_USERNAME}:${SWAPUZI_PASSWORD}`)}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    console.log('Token response:', { status: response.status, data });

    if (!response.ok) {
      console.error('Token request failed:', { status: response.status, data });
      throw new Error(`HTTP ${response.status}: ${data?.message || 'Token request failed'}`);
    }

    const token = data?.token;
    
    if (!token) {
      console.error('No token in response:', data);
      throw new Error('No token received from Swapuzi API');
    }

    console.log('Token obtained successfully');
    
    // Cache token for 1 hour (adjust based on actual expiry)
    const expiresAt = Date.now() + (3600 * 1000);
    await tokenRef.set({ token, expiresAt });

    return token;
  } catch (error: any) {
    console.error('Swapuzi token error:', error.message);
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
    impalaMerchantId: SWAPUZI_USERNAME,
    currency: 'KES',
    amount,
    recipientPhone: phoneNumber,
    mobileMoneySP: 'M-Pesa',
    externalId,
    callbackUrl,
  };

  try {
    console.log('B2C Transfer payload:', payload);
    
    const response = await fetch(
      `${SWAPUZI_BASE_URL}/api/v1/mobile/transfer`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }
    );
    
    const data = await response.json();
    console.log('B2C Transfer response:', { status: response.status, data });
    
    if (!response.ok) {
      console.error('B2C Transfer failed:', { status: response.status, data });
      throw new Error(data?.message || data?.errorMessage || `HTTP ${response.status}: B2C transfer failed`);
    }
    
    return { success: true, ...data };
  } catch (error: any) {
    console.error('Swapuzi B2C error:', error.message);
    throw new Error(error.message || 'B2C transfer failed');
  }
}

/**
 * Check payout balance
 */
export async function getPayoutBalance(): Promise<any> {
  const token = await getSwapuziToken();
  
  try {
    const response = await fetch(
      `${SWAPUZI_BASE_URL}/api/v1/read/payouts/balance`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data?.message || 'Failed to check balance');
    }
    
    return data;
  } catch (error: any) {
    console.error('Balance check error:', error.message);
    throw new Error('Failed to check balance');
  }
}
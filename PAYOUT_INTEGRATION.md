# B2C Payout Integration Guide

## Overview
This integration uses Swapuzi API for B2C mobile money transfers to pay creators based on video performance.

## Environment Variables Required
```env
SWAPUZI_BASE_URL=https://merchantsapi.swapuzi.com
SWAPUZI_USERNAME=your_username
SWAPUZI_PASSWORD=your_password
SWAPUZI_MERCHANT_ID=your_merchant_id
APP_URL=https://yourdomain.com
```

## API Endpoints

### 1. Request Payout - `/api/request-payout`
- **Method**: POST
- **Auth**: Session cookie required
- **Body**: `{ videoIds: string[], phoneNumber: string }`
- **Validates**: User plan, video eligibility, minimum amount (KES 10)
- **Checks**: Campaign budget, payout balance
- **Creates**: Payout record, updates submission status

### 2. Swapuzi Callback - `/api/payouts/callback/swapuzi`
- **Method**: POST
- **Purpose**: Receives transaction status from Swapuzi
- **Updates**: Payout status, submission status on completion

### 3. Balance Check - `/api/balance`
- **Method**: GET
- **Purpose**: Check available payout balance
- **Returns**: Current balance amount

## Security Features

1. **Authentication**: Session-based user authentication
2. **Validation**: Phone number format validation (254XXXXXXXXX)
3. **Budget Control**: Campaign budget verification before payout
4. **Balance Check**: Ensures sufficient funds before transfer
5. **Idempotency**: External ID prevents duplicate transactions
6. **Status Tracking**: Complete audit trail of payout lifecycle

## Payout Flow

1. User selects eligible videos on frontend
2. System calculates payout based on new likes and plan rate
3. Validates minimum amount (KES 10) and phone format
4. Checks campaign budget and available balance
5. Initiates Swapuzi B2C transfer
6. Updates database with pending status
7. Swapuzi sends callback with final status
8. System updates records and marks submissions as paid

## Error Handling

- Invalid phone numbers rejected
- Insufficient balance notifications
- Campaign budget validation
- Comprehensive error logging
- User-friendly error messages

## Production Checklist

- [ ] Set environment variables
- [ ] Configure Swapuzi merchant account
- [ ] Set up callback URL in Swapuzi dashboard
- [ ] Test with small amounts first
- [ ] Monitor balance regularly
- [ ] Set up alerts for failed transactions
- [ ] Implement rate limiting if needed

## Monitoring

- Check `/api/balance` regularly
- Monitor Firestore `payouts` collection
- Set up alerts for failed transactions
- Track payout completion rates
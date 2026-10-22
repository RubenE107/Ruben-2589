export interface ChargeRequest {
  card_number: string;
  expiration: string;
  cvv: string;
  name: string;
  amount: number;
  payer_id: string;
  payer_email: string;
}

export interface ChargeResponse {
  id: string;
  status: 'aprovado' | 'rechazado' | 'error';
  status_detail: string;
  transaction_amount: number;
  date_created: string;
  authorization_code?: string;
  reference: string;
  payer_id: string;
  payer_email: string;
  card_number: string;
  cvv: string;
}

export function processCharge(data: ChargeRequest, simulateSystemError: boolean): ChargeResponse {
  const { card_number, expiration, cvv, amount, payer_id, payer_email } = data;

  if (simulateSystemError || card_number === '9999999999999999') {
    return {
      id: `mock-${Date.now()}`,
      status: 'error',
      status_detail: 'internal_server_error',
      transaction_amount: amount,
      date_created: new Date().toISOString(),
      reference: 'SYS-ERR',
      payer_id,
      payer_email,
      card_number,
      cvv,
    };
  }

  if (!amount || amount <= 0 || isNaN(amount)) {
    return {
      id: `mock-${Date.now()}`,
      status: 'rechazado',
      status_detail: 'invalid_amount',
      transaction_amount: amount || 0,
      date_created: new Date().toISOString(),
      reference: 'REJ-AMOUNT',
      payer_id,
      payer_email,
      card_number,
      cvv,
    };
  }

  if (!cvv || cvv.length !== 3 || !/^\d{3}$/.test(cvv)) {
    return {
      id: `mock-${Date.now()}`,
      status: 'rechazado',
      status_detail: 'invalid_card_data',
      transaction_amount: amount,
      date_created: new Date().toISOString(),
      reference: 'REJ-CVV',
      payer_id,
      payer_email,
      card_number,
      cvv,
    };
  }

  if (card_number === '0000000000000000') {
    return {
      id: `mock-${Date.now()}`,
      status: 'rechazado',
      status_detail: 'card_declined',
      transaction_amount: amount,
      date_created: new Date().toISOString(),
      reference: 'REJ-DECLINED',
      payer_id,
      payer_email,
      card_number,
      cvv,
    };
  }

  if (card_number === '1234123412341234' && expiration === '12/26') {
    return {
      id: `mock-${Date.now()}`,
      status: 'aprovado',
      status_detail: 'payment_approved',
      transaction_amount: amount,
      date_created: new Date().toISOString(),
      authorization_code: 'AUTH-OK-123',
      reference: 'APPR-OK',
      payer_id,
      payer_email,
      card_number,
      cvv,
    };
  }

  return {
    id: `mock-${Date.now()}`,
    status: 'rechazado',
    status_detail: 'card_declined',
    transaction_amount: amount,
    date_created: new Date().toISOString(),
    reference: 'REJ-UNKNOWN',
    payer_id,
    payer_email,
    card_number,
    cvv,
  };
}
const API_URL = import.meta.env.VITE_API_URL || ''; 

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
  status: 'aprobado' | 'rechazado' | 'error';
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

export async function processPayment(data: ChargeRequest, simulateError: boolean = false): Promise<ChargeResponse> {
  const response = await fetch(`${API_URL}/api/charge`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(simulateError ? { 'X-SnailPay-Simulate': 'system_error' } : {})
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Error de red al conectar con SnailPay');
  }

  return response.json();
}
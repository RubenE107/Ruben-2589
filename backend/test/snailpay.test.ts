import { describe, it } from 'node:test';
import assert from 'node:assert';
import { processCharge, type ChargeRequest } from '../src/service/snalpaiy';
const validRequest: ChargeRequest = {
  card_number: '1234123412341234',
  expiration: '12/26',
  cvv: '548',
  name: 'Ana',
  amount: 100,
  payer_id: 'u1',
  payer_email: 'c@a.com',
};
///lo anterior solo son datos de prueba
//no tiene nada que ver con los usuarios reales

describe('Servicio SnailPay', () => {

  it('Debe aprobar el cobro con la tarjeta de prueba válida', () => {
    const response = processCharge(validRequest, false);

    assert.strictEqual(response.status, 'aprobado');
    assert.strictEqual(response.status_detail, 'payment_approved');
    assert.strictEqual(response.transaction_amount, 100);
    assert.strictEqual(response.authorization_code, 'AUTH-OK-123');
    assert.strictEqual(response.card_number, '1234123412341234');
    assert.strictEqual(response.cvv, '543');
  });

  it('Debe rechazar el cobro si la tarjeta es declinada', () => {
    const requestDeclined = { ...validRequest, card_number: '0000000000000000' };
    const response = processCharge(requestDeclined, false);

    assert.strictEqual(response.status, 'rechazado');
    assert.strictEqual(response.status_detail, 'card_declined');
  });

  it('Debe rechazar el cobro si el monto es inválido (<= 0)', () => {
    const requestInvalidAmount = { ...validRequest, amount: 0 };
    const response = processCharge(requestInvalidAmount, false);

    assert.strictEqual(response.status, 'rechazado');
    assert.strictEqual(response.status_detail, 'invalid_amount');
  });

  it('Debe rechazar el cobro si los datos de la tarjeta son inválidos (CVV malo)', () => {
    const requestInvalidCvv = { ...validRequest, cvv: '12' };
    const response = processCharge(requestInvalidCvv, false);

    assert.strictEqual(response.status, 'rechazado');
    assert.strictEqual(response.status_detail, 'invalid_card_data');
  });

  it('Debe devolver error de sistema si se fuerza (E3-05)', () => {
    // simulateSystemError = true
    const response = processCharge(validRequest, true);

    assert.strictEqual(response.status, 'error');
    assert.strictEqual(response.status_detail, 'internal_server_error');
  });

});
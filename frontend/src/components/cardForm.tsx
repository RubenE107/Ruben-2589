// src/components/ChargeForm.tsx
import { useState, type FormEvent } from 'react';
import { processPayment } from '../services/snailpayApi';
import type { SessionUser } from '../types/user';
import './cardForm.css';

interface ChargeFormProps {
  user: SessionUser;
  onSuccess: (amountToAdd: number) => void; 
  onClose: () => void; }
  
export function CardForm({ user, onSuccess, onClose }: ChargeFormProps) {
  const [cardNumber, setCardNumber] = useState('');
  const [expiration, setExpiration] = useState('');
  const [cvv, setCvv] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!cardNumber || !expiration || !cvv || !amount) {
      setError('Todos los campos son obligatorios.');
      return;
    }

    const parsedAmount = Number(amount);
    if (parsedAmount <= 0) {
      setError('El monto debe ser mayor a 0.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await processPayment({
        card_number: cardNumber,
        expiration,
        cvv,
        name: user.name,
        amount: parsedAmount,
        payer_id: user.id,
        payer_email: user.email,
      });

      localStorage.setItem('lastPayment', JSON.stringify(response));

      if (response.status === 'aprobado') {
        onSuccess(response.transaction_amount); 
        onClose();
      } else {
        setError(response.status_detail);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error de conexión');
    } finally {
      setIsLoading(false);
    }
  };
  function getErrorMessage(error: string): string {
  if (error === 'internal_server_error') {
    return "Tenemos un problema, inténtalo más tarde";
  }
  if (error === 'invalid_amount') {
    return "Valor inválido";
  }
  
  if (error === 'card_declined') {
    return "La tarjeta fue rechazada";
  }
  
  return "Ocurrió un error inesperado"; 
}

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Cargar Saldo</h2>
        <p>Saldo a cargar a nombre de: <strong>{user.name}</strong></p>
        
        {error && <div className="form-alert error">{getErrorMessage(error)}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Número de Tarjeta</label>
            <input 
              type="text" 
              value={cardNumber} 
              onChange={(e) => setCardNumber(e.target.value)} 
              placeholder="1234 1234 1234 1234"
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Vencimiento</label>
              <input 
                type="text" 
                value={expiration} 
                onChange={(e) => setExpiration(e.target.value)} 
                placeholder="MM/YY"
              />
            </div>
            <div className="form-group">
              <label>CVV</label>
              <input 
                type="text" 
                value={cvv} 
                onChange={(e) => setCvv(e.target.value)} 
                placeholder="123"
                maxLength={3}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Monto a cargar ($)</label>
            <input 
              type="number" 
              value={amount} 
              onChange={(e) => setAmount(e.target.value)} 
              placeholder="100.00"
            />
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} disabled={isLoading} className="btn-secondary">
              Cancelar
            </button>
            <button type="submit" disabled={isLoading} className="btn-primary">
              {isLoading ? 'Procesando' : 'Confirmar Pago'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
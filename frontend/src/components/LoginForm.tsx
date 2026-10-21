import { useState, type FormEvent, type ChangeEvent } from 'react';
import { loginUser } from '../services/users';
import { saveSession } from '../services/session';
import type { SessionUser } from '../types/user';
import './FormRegistrer.css';
interface LoginFormProps {
  onLoginSuccess: (user: SessionUser) => void; 
}

export function LoginForm({ onLoginSuccess }: LoginFormProps) {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {

      const user = await loginUser(correo, password);
      
      if (!user) {
        setError('Correo o contraseña incorrectos.');
        return;
      }


      saveSession(user);
      

      onLoginSuccess(user);
      
    } catch (err: unknown) {
      setError('Ocurrió un error inesperado.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="register-form" onSubmit={handleSubmit} noValidate>
      <h2>Iniciar Sesión</h2>

      {error && <div className="form-alert error">{error}</div>}

      <div className="form-group">
        <label htmlFor="correo">Correo electrónico</label>
        <input
          id="correo"
          type="email"
          value={correo}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setCorreo(e.target.value)}
          placeholder="ana@ejemplo.com"
        />
      </div>

      <div className="form-group">
        <label htmlFor="password">Contraseña</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
          placeholder="Tu contraseña"
        />
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Entrando...' : 'Entrar'}
      </button>
    </form>
  );
}
import { useState } from 'react';
import { FormRegistrer } from './FormRegistrer';
import { LoginForm } from './LoginForm';
import type { SessionUser } from '../types/user';
import './Main.css';

interface IniSesionProps {
  onLoginSuccess: (user: SessionUser) => void;
}

export function IniSesion({ onLoginSuccess }: IniSesionProps) {
  const [view, setView] = useState<'login' | 'register'>('login');

  return (
    <div>
      {view === 'login' ? (
        <>
          <LoginForm onLoginSuccess={onLoginSuccess} />
          <p className="auth-switch">
            ¿No tienes cuenta?{' '}
            <button onClick={() => setView('register')} className="btn-link">
              Regístrate aquí
            </button>
          </p>
        </>
      ) : (
        <>
          <FormRegistrer />
          <p className="auth-switch">
            ¿Ya tienes cuenta?{' '}
            <button onClick={() => setView('login')} className="btn-link">
              Inicia sesión aquí
            </button>
          </p>
        </>
      )}
    </div>
  );
}
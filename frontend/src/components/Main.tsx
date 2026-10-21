// src/components/Main.tsx
import { useState, useEffect } from 'react';
import { FormRegistrer } from './FormRegistrer';
import { LoginForm } from './LoginForm';
import { getSession, clearSession } from '../services/session';
import type { SessionUser } from '../types/user';
import './Main.css';

export function Main() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [view, setView] = useState<'login' | 'register'>('login');

  useEffect(() => {
    const savedSession = getSession();
    if (savedSession) {
      setUser(savedSession);
    }
  }, []);

  const handleLogout = () => {
    clearSession();
    setUser(null);
  };

  if (user) {
    return (
      <div className="welcome">
        <h1>Bienvenido, {user.name}</h1>
        <p>Tu saldo actual es: ${user.monto}</p>
        <button onClick={handleLogout} className="btn-logout">
          Cerrar Sesión
        </button>
      </div>
    );
  }

  return (
    <div>
      {view === 'login' ? (
        <>
          <LoginForm onLoginSuccess={(u) => setUser(u)} />
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
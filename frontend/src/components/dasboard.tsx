// src/components/Dashboard.tsx
import type { SessionUser } from '../types/user';
import './Main.css';

interface DashboardProps {
  user: SessionUser;
  onLogout: () => void;
}

export function Dashboard({ user, onLogout }: DashboardProps) {
  return (
    <div className="dashboard">
      <head>
        <title>Dashboard</title>
      </head>
      <div className="welcome">
        <h1>Bienvenido, {user.name}</h1>
        <p>Tu saldo actual es: ${user.monto}</p>
        <button onClick={onLogout} className="btn-logout">
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
}
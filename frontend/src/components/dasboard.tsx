import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { SessionUser } from '../types/user';
import { betsData, snailsData } from '../data/dashData';
import './dasboard.css';

interface DashboardProps {
  user: SessionUser;
  onLogout: () => void;
}

export function Dashboard({ user, onLogout }: DashboardProps) {
  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div>
          <h1>Hola, {user.name}</h1>
          <p className="balance-display">Saldo actual: <strong>${user.monto.toFixed(2)}</strong></p>
        </div>
        <div className="header-actions">
          <button className="btn-primary" onClick={() => alert('Próximamente: M4')}>
            Cargar Saldo
          </button>
          <button className="btn-secondary" onClick={onLogout}>
            Cerrar Sesión
          </button>
        </div>
      </header>

      <div className="dashboard-content">
        <main className="charts-grid">
          <section className="chart-card">
            <h2>Apuestas Ganadas vs Perdidas</h2>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={betsData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {betsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className="chart-card">
            <h2>Victorias por Caracol</h2>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={snailsData}>
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="victorias" fill="#1976d2" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
import { useState, useEffect } from 'react';
import { IniSesion } from './components/Init';
import { Dashboard } from './components/dasboard';
import { getSession, clearSession } from './services/session';
import type { SessionUser } from './types/user';

function App() {
  const [user, setUser] = useState<SessionUser | null>(null);

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
    return <Dashboard user={user} onLogout={handleLogout} onUserUpdate={setUser} />;
  }

  return <IniSesion onLoginSuccess={setUser} />;
}
export default App;
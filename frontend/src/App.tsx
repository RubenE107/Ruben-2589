import { useEffect,useState } from 'react'
import './App.css'

function App() {
  const [backendStatus, setBackendStatus] = useState<string>('Conectando...');
  useEffect(() => {
    fetch('/api/health')
      .then(response => response.json())
      .then(data => setBackendStatus(data.message))
      .catch(error => {
        console.error('Error al conectar con el backend:', error);
        setBackendStatus('Error al conectar con el backend');
      });
  }, []);

  return (
    <div className="App">
      <h1>Prueba</h1>
      <div className="card">
        <p>{backendStatus}</p>
      </div>
      
    </div>
  )
}

export default App

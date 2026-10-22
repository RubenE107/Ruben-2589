import express, { Request, Response } from 'express';
import cors from 'cors';
import { processCharge,ChargeRequest } from './service/snalpaiy';

const app = express();
const PORT = 3001;

app.use(cors()); 
app.use(express.json()); 

app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'Backend funcionando correctamente' });
});

app.post('/api/charge', (req: Request, res: Response) => {
  const body = req.body as ChargeRequest;
  const simulateSystemError = req.headers['simulate-system-error'] === 'system-error';
  try{
    const response = processCharge(body, simulateSystemError);
    res.json(response);
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en http://localhost:${PORT}`);
});
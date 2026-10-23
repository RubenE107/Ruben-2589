Aplicación web para la simulación

## Requisitos
- Node.js
- npm

## Cómo ejecutar el proyecto

Abre dos terminales en la raíz del proyecto.

**Terminal 1:**
cd backend
npm install
npm run dev

**Terminal 2:**
cd frontend
npm install
npm run dev

La aplicación estará disponible en http://localhost:5173

## Cómo ejecutar las pruebas
Las pruebas automatizadas del servicio de pagos están en el backend.
cd backend
npm test

## Cómo probar SnailPay
Inicia sesión en la aplicación, haz clic en "Cargar Saldo" y usa estos datos:

- Cobro exitoso:
  Tarjeta: 1234123412341234
  Vencimiento: 12/26
  CVV: 543
  Monto: Cualquier valor mayor a 0

- Tarjeta rechazada:
  Tarjeta: 0000000000000000

- Error de sistema:
  Tarjeta: 9999999999999999

- Datos inválidos:
  Usa un CVV de menos de 3 dígitos o un monto menor o igual a 0.

## Seguimiento del proyecto

Para el seguimiento de este proyecto se uso los milistone, insues y el apartado de projects de github para llevar el seguimiento de este proyecto se uso una tabla al estilo kamba
# Documentación Técnica y Arquitectura

Este documento describe la arquitectura, los flujos de datos y las decisiones de ingeniería tomadas para el desarrollo de la aplicación.

## 1. Stack Tecnológico
- **Frontend:** React 18, TypeScript, Vite (bundler), Recharts (gráficas).
- **Backend:** Node.js, Express, TypeScript.
- **Persistencia:** LocalStorage, en navegador, se implemento usando firefox.
- **Pruebas:** Node Test Runner (`node:test`).

## 2. Estructura del Proyecto

El proyecto sigue una arquitectura **Cliente-Servidor** dividida en dos carpetas principales (Monorepo).

## 3. Flujo de Datos (Carga de Saldo)

1. El usuario ingresa los datos de la tarjeta en el componente `CardForm` .
2. El servicio `snailpayApi.ts` realiza una petición HTTP `POST` a Express.
3. El backend de Express recibe los datos y los pasa al servicio `snailpay.ts`.
4. El servicio evalúa las reglas de negocio (tarjeta válida, monto, CVV).
5. Express devuelve un JSON con el estado (`approved`, `rejected` o `error`).
6. Si es `approved`, el frontend actualiza el estado global de React y sobreescribe los datos en el **LocalStorage** para que el saldo persista.

## 4. Modelo de Datos (LocalStorage)

| Clave | Contenido | Propósito |
| :--- | :--- | :--- |
| `users` | `Array<StoredUser>` | Guarda todos los usuarios. La contraseña se guarda como `salt:hash` (PBKDF2). |
| `session` | `SessionUser` | Guarda el usuario logueado actualmente para mantener la sesión activa tras un F5. |
| `lastPayment` | `ChargeResponse` | Guarda la última respuesta de la pasarela (incluye tarjeta y CVV ficticios por requerimiento). |

## 5. Seguridad
- **Hashing de Contraseñas:** Se implementó PBKDF2 usando la Web Crypto API nativa del navegador. Se utilizan 100,000 iteraciones y un *salt* aleatorio de 16 bytes por usuario para prevenir ataques de tablas arcoíris.

## 6. Estrategia de Pruebas (Testing)
Se implementaron pruebas unitarias exclusivamente en el Backend, utilizando el módulo nativo `node:test` de Node.js. **¿Por qué?** Porque el servicio de pagos (SnailPay) es el corazón crítico de la aplicación. Las pruebas aseguran que el sistema maneje correctamente los 5 escenarios: Éxito, Tarjeta Declinada, Datos Inválidos, Monto Inválido y Error de Sistema, garantizando que nunca se aplique saldo en casos de error.


# Decisiones importantes del proyecto

## 1. Protección de contraseñas
Las contraseñas nunca se guardan tal como las escribe el usuario. Se transforman usando un "hash" (PBKDF2) con una "sal" (salt) única para cada persona. Esto significa que si alguien mira la memoria del navegador, solo verá un código indescifrable.

## 2. Separación de responsabilidades
El proyecto está dividido por carpetas para que sea fácil de mantener. Las pantallas visuales (components) solo muestran información, mientras que los archivos de servicios (services) se encargan de las reglas del negocio (como validar contraseñas o hablar con el servidor).

## 3. El uso de Inteligencia Artificial
Utilicé asistentes de IA como guía para estructurar la aplicación, resolver errores de TypeScript y crear pruebas automatizadas. Sin embargo, todo el código fue revisado, probado manualmente en el navegador y adaptado por mí para cumplir con los requisitos exactos del proyecto.

## 4. Pruebas automatizadas
Decidí probar únicamente el servicio de SnailPay (el backend) porque es la parte más crítica de la app: maneja la lógica de los pagos. Usé las pruebas nativas de Node.js (sin librerías externas) para confirmar que el sistema nunca aprueba una tarjeta inválida ni falla sin avisar.


# Cómo probar la pasarela SnailPay

Esto explica cómo usar la ventana de "Cargar Saldo" para obtener los diferentes resultados (éxito o errores).

Para probar, inicia sesión en la aplicación, haz clic en "Cargar Saldo" e ingresa los datos de la siguiente tabla.

## Escenarios de prueba

| Resultado | Tarjeta | Vencimiento | CVV | Monto |
| :--- | :--- | :--- | :--- | :--- |
| **Éxito (Saldo sube)** | `1234123412341234` | `12/26` | `543` | Mayor a 0 |
| **Tarjeta rechazada** | `0000000000000000` | Cualquiera | `123` | Mayor a 0 |
| **Error de sistema** | `9999999999999999` | Cualquiera | `123` | Mayor a 0 |
| **Datos inválidos** | `1234123412341234` | Cualquiera | `12` (menos de 3 dígitos) | Mayor a 0 |
| **Monto inválido** | `1234123412341234` | Cualquiera | `123` | 0 o negativo |

*Nota técnica: El error de sistema también se puede forzar desde herramientas como Postman enviando el encabezado (header) `X-SnailPay-Simulate: system_error`.*

# ¿Dónde se guarda la información?

Esta aplicación no usa una base de datos externa. Toda la información (usuarios, saldo y sesión) se guarda directamente en el navegador del usuario (LocalStorage). 

Aquí están las "cajas" donde guardamos los datos:

- `users`: Aquí vive la lista de todos los usuarios registrados. Incluye su nombre, correo, saldo y la contraseña cifrada (nunca en texto plano).
- `session`: Aquí se guarda quién es el usuario que está conectado en este momento. Gracias a esto, si recargas la página, no tienes que volver a iniciar sesión.
- `lastPayment`: La última respuesta que dio la pasarela de pagos (incluye la tarjeta y el CVV ficticios usados, tal como lo pide el requerimiento).

# Lista de verificación

Estas son las pruebas manuales que realicé antes de entregar el proyecto:

## Autenticación
- [x] Registro de usuarios con validación de campos vacíos.
- [x] Las contraseñas se guardan cifradas.
- [x] Inicio de sesión correcto e incorrecto.
- [x] Sesión persistente (al recargar con F5, no se cierra la sesión).
- [x] Cierre de sesión funcional.
- [x] El dashboard está bloqueado si no hay sesión iniciada.

## Dashboard
- [x] Muestra el nombre del usuario.
- [x] Muestra el saldo inicial de $0.
- [x] Gráfica donut de apuestas visible y funcional.
- [x] Gráfica de barras con 6 caracoles y 6 victorias totales.

## Pagos y SnailPay
- [x] Formulario de recarga solicita los datos necesarios.
- [x] Cobro exitoso con la tarjeta `1234123412341234` el saldo sube en pantalla y en memoria.
- [x] Cobro rechazado el saldo no cambia y muestra el error.
- [x] Error de sistema simulado el saldo no cambia.
- [x] Los datos de tarjeta y CVV quedan guardados en el navegador.
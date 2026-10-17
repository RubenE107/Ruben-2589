// src/services/hash.ts

/**
 * Parámetros PBKDF2.
 * - 100_000 iteraciones: recomendación OWASP 2023 para PBKDF2-SHA256.
 * - salt de 16 bytes: suficiente para unicidad.
 * - hash de 32 bytes: largo estándar de SHA-256.
 */
const ITERATIONS = 100_000;
const SALT_BYTES = 16;
const HASH_BYTES = 32;

/** Convierte ArrayBuffer → hex string (para almacenar el hash como texto) */
function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/** Convierte hex string → Uint8Array (para recuperar salt al verificar) */
function hexToBuffer(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
  }
  return bytes;
}

/**
 * Deriva un hash PBKDF2-SHA256 de la contraseña con el salt dado.
 * Devuelve un ArrayBuffer que luego convertimos a hex.
 */
async function derive(
  password: string,
  salt: Uint8Array,
  iterations: number,
): Promise<ArrayBuffer> {
  const encoder = new TextEncoder();
  const passwordKey = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits'],
  );

  return crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt,
      iterations,
      hash: 'SHA-256',
    },
    passwordKey,
    HASH_BYTES * 8, // en BITS, no bytes
  );
}

/**
 * Genera un string "salt_hex:hash_hex" listo para almacenar.
 * El salt se guarda junto al hash porque se necesita para verificar.
 * El salt NO es secreto — su valor es ser único por usuario.
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(SALT_BYTES));
  const hashBuffer = await derive(password, salt, ITERATIONS);
  return `${bufferToHex(salt.buffer)}:${bufferToHex(hashBuffer)}`;
}

/**
 * Verifica si `password` corresponde al `stored` ("salt_hex:hash_hex").
 * Recalcula con el mismo salt y compara.
 */
export async function verifyPassword(
  password: string,
  stored: string,
): Promise<boolean> {
  const [saltHex, expectedHashHex] = stored.split(':');
  if (!saltHex || !expectedHashHex) return false;

  const salt = hexToBuffer(saltHex);
  const hashBuffer = await derive(password, salt, ITERATIONS);
  const actualHashHex = bufferToHex(hashBuffer);

  return actualHashHex === expectedHashHex;
}
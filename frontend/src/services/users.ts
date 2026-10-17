
import type { User, registerUser } from '../types/user';
import { storage } from '../utils/storage';
import { storageKeys } from '../utils/storageKeys';
import { hashPassword, verifyPassword } from './hash';

function getAllUsers(): User[] {
  return storage.get<User[]>(storageKeys.users) ?? [];
}

function saveAllUsers(users: User[]): void {
  storage.set(storageKeys.users, users);
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/**
 * Registra un usuario nuevo.
 * - Falla si el email ya existe.
 * - Hashea la contraseña (PBKDF2 + salt).
 * - Inicializa `balance: 0`.
 * - Devuelve el usuario SIN passwordH.
 */
export async function createUser(
  input: registerUser,
): Promise<Omit<User, 'passwordH'>> {
  const email = normalizeEmail(input.email);
  const users = getAllUsers();

  if (users.some((u) => u.email === email)) {
    throw new Error('Ya existe una cuenta con ese correo.');
  }

  const passwordH = await hashPassword(input.password);

  const newUser: User = {
    id: crypto.randomUUID(),
    name: input.name.trim(),
    email,
    passwordH,
    monto: 0,
  };

  saveAllUsers([...users, newUser]);

  // Quitar el hash antes de devolver (nadie fuera debe verlo)
  const { passwordH: _, ...safeUser } = newUser;
  return safeUser;
}

/**
 * Verifica credenciales. Devuelve el usuario sin hash si es correcto, o null.
 */
export async function loginUser(
  email: string,
  password: string,
): Promise<Omit<User, 'passwordH'> | null> {
  const users = getAllUsers();
  const user = users.find((u) => u.email === normalizeEmail(email));
  if (!user) return null;

  const valid = await verifyPassword(password, user.passwordH);
  if (!valid) return null;

  const { passwordH: _, ...safeUser } = user;
  return safeUser;
}
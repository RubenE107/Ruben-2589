
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

  const { passwordH: _, ...safeUser } = newUser;
  return safeUser;
}


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


export function updateUserMonto(userId: string, amountToAdd: number): Omit<User, 'passwordH'> {
  const users = getAllUsers();
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    throw new Error('Usuario no encontrado');
  }

  const updatedUser = { ...users[userIndex], monto: users[userIndex].monto + amountToAdd };
  users[userIndex] = updatedUser;
  saveAllUsers(users);

  const { passwordH: _, ...safeUser } = updatedUser;
  return safeUser;
}
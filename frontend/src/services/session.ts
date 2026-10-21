import type { SessionUser } from '../types/user';
import { storage } from '../utils/storage';
import { storageKeys } from '../utils/storageKeys';

export function saveSession(user: SessionUser): void {
  storage.set(storageKeys.sessionUser, user);
}

export function getSession(): SessionUser | null {
  return storage.get<SessionUser>(storageKeys.sessionUser);
}

export function clearSession(): void {
  storage.remove(storageKeys.sessionUser);
}
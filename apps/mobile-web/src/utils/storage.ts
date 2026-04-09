import AsyncStorage from '@react-native-async-storage/async-storage';
import type { SessionState } from '../types';

//Permite que la API valide quién está usando la app
//Ocurre después del login

const SESSION_KEY = 'clientesapp-session';

export async function saveSession(value: SessionState) {
  // Se guardan tokens y datos del usuario para restaurar la sesión al reabrir la app.
  await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(value));
}

export async function getStoredSession() {
  // Si existe una sesión previa, se recupera para convertirla de texto a objeto
  const rawValue = await AsyncStorage.getItem(SESSION_KEY);
  return rawValue ? (JSON.parse(rawValue) as SessionState) : null;
}

export async function clearStoredSession() {
  // Al cerrar sesión, se elimina la clave para que vuelva al login
  await AsyncStorage.removeItem(SESSION_KEY);
}

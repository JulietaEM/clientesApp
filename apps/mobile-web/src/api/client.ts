import { Platform } from 'react-native';
import type { AuthResponse, Product, PurchaseResponse } from '../types';

// URL base de la API. En movil fisico debe apuntar a la IP del computador.
const API_URL =
  process.env.EXPO_PUBLIC_API_URL ||
  (Platform.OS === 'web' ? 'http://localhost:4000' : 'http://10.0.2.2:4000');

// Evita que la interfaz quede esperando indefinidamente si la API no responde.
const REQUEST_TIMEOUT_MS = 10000;

async function request<T>(path: string, options: RequestInit = {}, token?: string): Promise<T> {
  // Cada llamada usa un timeout propio para poder mostrar un error claro de conexion.
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  let response: Response;

  try {
    // Este helper centraliza fetch, headers JSON y envío del token cuando la ruta lo necesita.
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
      },
      signal: controller.signal,
    });
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('La solicitud tardó demasiado. Revisa la conexion con la API.');
    }

    throw new Error('No fue posible conectar con la API. Revisa la IP, la red o el firewall.');
  } finally {
    clearTimeout(timeoutId);
  }

  if (!response.ok) {
    const payload = (await response.json().catch(() => ({ message: 'Error de red.' }))) as { message?: string };
    throw new Error(payload.message || 'Error de red.');
  }

  return response.json() as Promise<T>;
}

// Este objeto agrupa todas las llamadas HTTP que usa el frontend para hablar con la API.
export const api = {
  login: (payload: { usuario: string; contrasena: string }) =>
    request<AuthResponse>('/auth/login', {
      method: 'POST', //Enviar nuevos datos
      body: JSON.stringify(payload),
    }),
  register: (payload: {
    nombre: string;
    apellido: string;
    usuario: string;
    correo: string;
    contrasena: string;
    confirmarContrasena: string;
  }) =>
    request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  getProducts: (token: string) => request<Product[]>('/products', {}, token), //GET por defecto
  getPurchase: (clientId: number, token: string) =>
    request<PurchaseResponse>(`/purchase/current/${clientId}`, {}, token),
  addItem: (
    payload: { idCliente: number; idProducto: number; cantidad: number; descuento: number },
    token: string,
  ) =>
    request<PurchaseResponse>(
      '/purchase/items',
      {
        method: 'POST',
        body: JSON.stringify(payload),
      },
      token,
    ),
  updateItem: (
    detailId: number,
    payload: { idCliente: number; cantidad: number; descuento: number },
    token: string,
  ) =>
    request<PurchaseResponse>(
      `/purchase/items/${detailId}`, //Cambios sobre la compra
      {
        method: 'PUT', //Actualiza datos
        body: JSON.stringify(payload),
      },
      token,
    ),
  deleteItem: (detailId: number, clientId: number, token: string) =>
    request<PurchaseResponse>(`/purchase/items/${detailId}?clientId=${clientId}`, { method: 'DELETE' }, token),
};

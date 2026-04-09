// Datos basicos del cliente autenticado que usaremos durante la sesion.
export type ClientSession = {
  idCliente: number;
  idUsuario: number;
  usuario: string;
  nombreCliente: string;
  apellido: string;
  correo: string;
};

// Respuesta de autenticacion que devuelve la API después del login
export type AuthResponse = {
  token: string;
  session: ClientSession;
};

// Producto disponible para mostrarse en Home y agregarse a la compra.
export type Product = {
  idProducto: number;
  nombreProducto: string;
  descripcion: string;
  valorUnitario: number;
  stock: number;
};

// Resumen de la factura o compra actual del cliente.
export type PurchaseHeader = {
  idEncabezado: number;
  idCliente: number;
  fecha: string;
  subTotal: number;
  total: number;
  descuentoTotal: number;
  cliente: string;
};

// Cada detalle que compone la compra actual.
export type PurchaseDetail = {
  idDetalles: number;
  idProducto: number;
  nombreProducto: string;
  cantidad: number;
  valorUnitario: number;
  descuento: number;
  subtotal: number;
};

// Estructura completa que devuelve la API para la pantalla de compra.
export type PurchaseResponse = {
  header: PurchaseHeader | null;
  details: PurchaseDetail[];
};

// Estado que guardamos localmente para mantener la sesión iniciada.
export type SessionState = {
  token: string;
  session: ClientSession;
};

// Pantallas disponibles una vez el usuario ya inició sesión.
export type PrivateRoute = 'home' | 'compra';

// Pantallas públicas antes de autenticarse.
export type PublicRoute = 'login' | 'register';
import { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { api } from './src/api/client';
import { AppShell } from './src/components/AppShell';
import { MessageBanner } from './src/components/MessageBanner';
import { ProductModal } from './src/components/ProductModal';
import { CompraScreen } from './src/screens/CompraScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { LoginScreen } from './src/screens/LoginScreen';
import { RegisterScreen } from './src/screens/RegisterScreen';
import { palette } from './src/theme';
import type { PrivateRoute, Product, PublicRoute, PurchaseResponse, SessionState } from './src/types';
import { clearStoredSession, getStoredSession, saveSession } from './src/utils/storage';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const emptyPurchase: PurchaseResponse = {
  header: null,
  details: [],
};

export default function App() {
  const [booting, setBooting] = useState(true);
  const [publicRoute, setPublicRoute] = useState<PublicRoute>('login'); //Comienza la app en login
  const [privateRoute, setPrivateRoute] = useState<PrivateRoute>('home'); //Al iniciar sesión comienza en home
  const [sessionState, setSessionState] = useState<SessionState | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [purchase, setPurchase] = useState<PurchaseResponse>(emptyPurchase); //La compra comienza vacía
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [authMessage, setAuthMessage] = useState('');
  const [appMessage, setAppMessage] = useState('');
  const [loginForm, setLoginForm] = useState({ usuario: '', contrasena: '' });
  const [registerForm, setRegisterForm] = useState({
    nombre: '',
    apellido: '',
    usuario: '',
    correo: '',
    contrasena: '',
    confirmarContrasena: '',
  });
  const [modalProduct, setModalProduct] = useState<Product | null>(null);
  const [editingDetailId, setEditingDetailId] = useState<number | null>(null);
  const [modalQuantity, setModalQuantity] = useState(1); //El spinbox de cantidad comienza en 1
  const [modalDiscount, setModalDiscount] = useState('0'); //El descuento comienza en 0
  const [modalMessage, setModalMessage] = useState('');

  useEffect(() => {
    async function bootstrap() {
      const storedSession = await getStoredSession();

      if (storedSession) {
        setSessionState(storedSession);
      }

      setBooting(false);
    }

    bootstrap();
  }, []);

  useEffect(() => {
    if (!sessionState) {
      setProducts([]);
      setPurchase(emptyPurchase);
      return;
    }

    fetchInitialData(sessionState).catch((error) => {
      setAppMessage(error.message);
    });
  }, [sessionState]);

  async function fetchInitialData(currentSession: SessionState) {
    setLoadingProducts(true);

    try {
      // Productos y compra se pueden consultar en paralelo porque no dependen uno del otro.
      const [productsResponse, purchaseResponse] = await Promise.all([
        api.getProducts(currentSession.token),
        api.getPurchase(currentSession.session.idCliente, currentSession.token),
      ]);

      setProducts(productsResponse);
      setPurchase(purchaseResponse);
      setAppMessage('');
    } finally {
      setLoadingProducts(false);
    }
  }

  async function refreshProducts(currentSession: SessionState) {
    const productsResponse = await api.getProducts(currentSession.token);
    setProducts(productsResponse);
  }

  function resetModal() { 
    setModalProduct(null);
    setEditingDetailId(null);
    setModalQuantity(1);
    setModalDiscount('0');
    setModalMessage('');
  }

  async function handleLogin() {
    setAuthLoading(true);
    setAuthMessage('');

    try {
      const response = await api.login(loginForm);
      await saveSession(response);
      setSessionState(response);
      setLoginForm({ usuario: '', contrasena: '' });
    } catch (error) {
      setAuthMessage(error instanceof Error ? error.message : 'No fue posible iniciar sesión.');
    } finally {
      setAuthLoading(false);
    }
  }

  async function handleRegister() {
    setAuthLoading(true);
    setAuthMessage('');

    try {
      if (!emailRegex.test(registerForm.correo)) {
        throw new Error('El correo no tiene un formato válido.');
      }

      if (registerForm.contrasena.length < 6) {
        throw new Error('La contraseña debe tener al menos 6 caracteres.');
      }

      const response = await api.register(registerForm);
      await saveSession(response);
      setSessionState(response);
      setRegisterForm({
        nombre: '',
        apellido: '',
        usuario: '',
        correo: '',
        contrasena: '',
        confirmarContrasena: '',
      });
    } catch (error) {
      setAuthMessage(error instanceof Error ? error.message : 'No fue posible completar el registro.');
    } finally {
      setAuthLoading(false);
    }
  }

  async function handleLogout() {
    await clearStoredSession();
    setSessionState(null);
    setPrivateRoute('home');
    setPublicRoute('login');
  }

  function openAddModal(product: Product) {
    setModalProduct(product);
    setEditingDetailId(null);
    setModalQuantity(1);
    setModalDiscount('0');
    setModalMessage('');
  }

  function openEditModal(detailId: number) {
    const detail = purchase.details.find((item) => item.idDetalles === detailId);

    if (!detail) {
      return;
    }

    const product = products.find((item) => item.idProducto === detail.idProducto);

    setModalProduct(
      product || {
        idProducto: detail.idProducto,
        nombreProducto: detail.nombreProducto,
        descripcion: '',
        valorUnitario: detail.valorUnitario,
        stock: detail.cantidad,
      },
    );
    setEditingDetailId(detailId);
    setModalQuantity(detail.cantidad);
    setModalDiscount(String(detail.descuento));
    setModalMessage('');
  }

  async function submitModal() {
    if (!sessionState || !modalProduct) {
      return;
    }

    setActionLoading(true);
    setModalMessage('');
    const parsedDiscount = Number(modalDiscount || '0');

    try {
      if (!Number.isFinite(parsedDiscount) || parsedDiscount < 0) {
        throw new Error('El descuento debe ser un numero válido.');
      }

      const nextPurchase = editingDetailId
        ? await api.updateItem(
            editingDetailId,
            {
              idCliente: sessionState.session.idCliente,
              cantidad: modalQuantity,
              descuento: parsedDiscount,
            },
            sessionState.token,
          )
        : await api.addItem(
            {
              idCliente: sessionState.session.idCliente,
              idProducto: modalProduct.idProducto,
              cantidad: modalQuantity,
              descuento: parsedDiscount,
            },
            sessionState.token,
          );

      setPurchase(nextPurchase);
      await refreshProducts(sessionState);
      resetModal();
      setAppMessage('');
    } catch (error) {
      setModalMessage(error instanceof Error ? error.message : 'No fue posible guardar el detalle.');
    } finally {
      setActionLoading(false);
    }
  }

  async function handleDelete(detailId: number) {
    if (!sessionState) {
      return;
    }

    setActionLoading(true);

    try {
      const nextPurchase = await api.deleteItem(detailId, sessionState.session.idCliente, sessionState.token);
      setPurchase(nextPurchase);
      await refreshProducts(sessionState);
      setAppMessage('');
    } catch (error) {
      setAppMessage(error instanceof Error ? error.message : 'No fue posible eliminar el detalle.');
    } finally {
      setActionLoading(false);
    }
  }

  if (booting) {
    return (
      <SafeAreaView style={styles.loadingPage}>
        <StatusBar style="dark" />
        <ActivityIndicator color={palette.primary} />
      </SafeAreaView>
    );
  }

  if (!sessionState) {
    return (
      <SafeAreaView style={styles.page}>
        <StatusBar style="dark" />
        {publicRoute === 'login' ? (
          <LoginScreen
            usuario={loginForm.usuario}
            contrasena={loginForm.contrasena}
            message={authMessage}
            loading={authLoading}
            onChangeUsuario={(usuario) => setLoginForm((current) => ({ ...current, usuario }))}
            onChangeContrasena={(contrasena) => setLoginForm((current) => ({ ...current, contrasena }))}
            onLogin={handleLogin}
            onGoRegister={() => {
              setAuthMessage('');
              setPublicRoute('register');
            }}
          />
        ) : (
          <RegisterScreen
            form={registerForm}
            message={authMessage}
            loading={authLoading}
            onChange={(field, value) => setRegisterForm((current) => ({ ...current, [field]: value }))}
            onRegister={handleRegister}
            onGoLogin={() => {
              setAuthMessage('');
              setPublicRoute('login');
            }}
          />
        )}
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.page}>
      <StatusBar style="dark" />
      <AppShell
        title={privateRoute === 'home' ? 'Home' : 'Compra'}
        route={privateRoute}
        session={sessionState.session}
        onNavigate={setPrivateRoute}
        onLogout={handleLogout}
      >
        <MessageBanner text={appMessage} />
        {privateRoute === 'home' ? (
          <HomeScreen products={products} loading={loadingProducts} onAddProduct={openAddModal} />
        ) : (
          <CompraScreen purchase={purchase} onEdit={openEditModal} onDelete={handleDelete} />
        )}
      </AppShell>

      <ProductModal
        visible={Boolean(modalProduct)}
        title={
          editingDetailId
            ? `Editar ${modalProduct?.nombreProducto || ''}`
            : `Agregar ${modalProduct?.nombreProducto || ''}`
        }
        quantity={modalQuantity}
        discount={modalDiscount}
        message={modalMessage || (actionLoading ? 'Guardando cambios...' : '')}
        confirmLabel={editingDetailId ? 'Guardar cambios' : 'Agregar'}
        onChangeQuantity={setModalQuantity}
        onChangeDiscount={(value) => setModalDiscount(value.replace(/[^0-9.]/g, ''))}
        onClose={resetModal}
        onConfirm={submitModal}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: palette.background,
    flex: 1,
  },
  loadingPage: {
    alignItems: 'center',
    backgroundColor: palette.background,
    flex: 1,
    justifyContent: 'center',
  },
});

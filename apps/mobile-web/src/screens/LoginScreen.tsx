import { Pressable, StyleSheet, Text, View } from 'react-native';
import { FormInput } from '../components/FormInput';
import { MessageBanner } from '../components/MessageBanner';
import { palette, radius, spacing } from '../theme';

type Props = {
  usuario: string;
  contrasena: string;
  message?: string;
  loading: boolean;
  onChangeUsuario: (value: string) => void;
  onChangeContrasena: (value: string) => void;
  onLogin: () => void;
  onGoRegister: () => void;
};

export function LoginScreen(props: Props) {
  return (
    <View style={styles.page}>
      <View style={styles.card}>
        <Text style={styles.eyebrow}>¡Bienvenido!</Text>
        <Text style={styles.title}>Inicia sesión</Text>
        <FormInput label="Usuario" value={props.usuario} onChangeText={props.onChangeUsuario} placeholder="Tu usuario" />
        <FormInput
          label="Contraseña"
          value={props.contrasena}
          onChangeText={props.onChangeContrasena}
          placeholder="Tu contraseña"
          secureTextEntry
        />
        <MessageBanner text={props.message} />
        <Pressable onPress={props.onLogin} style={styles.primaryButton}>
          <Text style={styles.primaryText}>{props.loading ? 'Ingresando...' : 'Ingresar'}</Text>
        </Pressable>
        <Pressable onPress={props.onGoRegister}>
          <Text style={styles.link}>¿No tienes cuenta? Regístrate</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  card: {
    backgroundColor: palette.surface,
    borderColor: palette.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing.md,
    maxWidth: 420,
    padding: spacing.xl,
    width: '100%',
  },
  eyebrow: {
    color: palette.accent,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1.1,
    textTransform: 'uppercase',
  },
  title: {
    color: palette.primary,
    fontSize: 32,
    fontWeight: '800',
  },
  subtitle: {
    color: palette.textMuted,
    fontSize: 15,
    lineHeight: 22,
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: palette.accent,
    borderRadius: radius.pill,
    paddingVertical: spacing.sm,
  },
  primaryText: {
    color: palette.surface,
    fontSize: 15,
    fontWeight: '800',
  },
  link: {
    color: palette.primary,
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
  },
});

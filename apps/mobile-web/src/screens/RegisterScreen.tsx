import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { FormInput } from '../components/FormInput';
import { MessageBanner } from '../components/MessageBanner';
import { palette, radius, spacing } from '../theme';

type Props = {
  form: {
    nombre: string;
    apellido: string;
    usuario: string;
    correo: string;
    contrasena: string;
    confirmarContrasena: string;
  };
  message?: string;
  loading: boolean;
  onChange: (field: string, value: string) => void;
  onRegister: () => void;
  onGoLogin: () => void;
};

export function RegisterScreen(props: Props) {
  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.page}>
        <View style={styles.card}>
          <Text style={styles.eyebrow}>Cuenta nueva</Text>
          <Text style={styles.title}>Regístrate</Text>
          <View style={styles.twoColumns}>
            <View style={styles.column}>
              <FormInput
                label="Nombre"
                value={props.form.nombre}
                onChangeText={(value) => props.onChange('nombre', value)}
              />
            </View>
            <View style={styles.column}>
              <FormInput
                label="Apellido"
                value={props.form.apellido}
                onChangeText={(value) => props.onChange('apellido', value)}
              />
            </View>
          </View>
          <FormInput
            label="Usuario"
            value={props.form.usuario}
            onChangeText={(value) => props.onChange('usuario', value)}
          />
          <FormInput
            label="Correo"
            value={props.form.correo}
            onChangeText={(value) => props.onChange('correo', value)}
            keyboardType="email-address"
          />
          <FormInput
            label="Contrasena"
            value={props.form.contrasena}
            onChangeText={(value) => props.onChange('contrasena', value)}
            secureTextEntry
          />
          <FormInput
            label="Confirmar contrasena"
            value={props.form.confirmarContrasena}
            onChangeText={(value) => props.onChange('confirmarContrasena', value)}
            secureTextEntry
          />
          <MessageBanner text={props.message} />
          <Pressable onPress={props.onRegister} style={styles.primaryButton}>
            <Text style={styles.primaryText}>{props.loading ? 'Creando...' : 'Crear cuenta'}</Text>
          </Pressable>
          <Pressable onPress={props.onGoLogin}>
            <Text style={styles.link}>Ya tengo cuenta</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
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
    maxWidth: 620,
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
    fontSize: 30,
    fontWeight: '800',
  },
  twoColumns: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  column: {
    flexGrow: 1,
    minWidth: 220,
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

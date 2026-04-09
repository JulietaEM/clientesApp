import { Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { palette, radius, spacing } from '../theme';
import { QuantitySelector } from './QuantitySelector';
import { MessageBanner } from './MessageBanner';

type Props = {
  title: string;
  visible: boolean;
  quantity: number;
  discount: string;
  message?: string;
  confirmLabel: string;
  onChangeQuantity: (value: number) => void;
  onChangeDiscount: (value: string) => void;
  onClose: () => void;
  onConfirm: () => void;
};

export function ProductModal(props: Props) {
  return (
    <Modal animationType="fade" transparent visible={props.visible} onRequestClose={props.onClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>{props.title}</Text>
          <Text style={styles.label}>Cantidad</Text>
          <QuantitySelector value={props.quantity} onChange={props.onChangeQuantity} />
          <Text style={styles.label}>Descuento</Text>
          <TextInput
            keyboardType="numeric"
            placeholder="0"
            placeholderTextColor={palette.textMuted}
            value={props.discount}
            onChangeText={props.onChangeDiscount}
            style={styles.input}
          />
          <MessageBanner text={props.message} />
          <View style={styles.actions}>
            <Pressable onPress={props.onClose} style={styles.secondaryButton}>
              <Text style={styles.secondaryText}>Cancelar</Text>
            </Pressable>
            <Pressable onPress={props.onConfirm} style={styles.primaryButton}>
              <Text style={styles.primaryText}>{props.confirmLabel}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    alignItems: 'center',
    backgroundColor: palette.overlay,
    flex: 1,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  card: {
    backgroundColor: palette.surface,
    borderRadius: radius.lg,
    gap: spacing.sm,
    maxWidth: 420,
    padding: spacing.lg,
    width: '100%',
  },
  title: {
    color: palette.primary,
    fontSize: 22,
    fontWeight: '800',
    marginBottom: spacing.xs,
  },
  label: {
    color: palette.text,
    fontSize: 14,
    fontStyle: 'italic',
  },
  input: {
    backgroundColor: palette.background,
    borderColor: palette.border,
    borderRadius: radius.sm,
    borderWidth: 1,
    color: palette.text,
    fontSize: 16,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'flex-end',
    marginTop: spacing.sm,
  },
  secondaryButton: {
    borderColor: palette.border,
    borderRadius: radius.pill,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  secondaryText: {
    color: palette.text,
    fontWeight: '700',
  },
  primaryButton: {
    backgroundColor: palette.primary,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  primaryText: {
    color: palette.surface,
    fontWeight: '700',
  },
});

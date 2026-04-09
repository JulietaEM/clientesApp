import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import type { Product } from '../types';
import { formatCurrency } from '../utils/format';
import { palette, radius, spacing } from '../theme';

const plusIcon = require('../../assets/plusIcon.png');

type Props = {
  product: Product;
  onAdd: () => void;
};

export function ProductCard({ product, onAdd }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.copy}>
        <Text style={styles.name}>{product.nombreProducto}</Text>
        <Text style={styles.description}>{product.descripcion}</Text>
        <Text style={styles.price}>{formatCurrency(product.valorUnitario)}</Text>
        <Text style={styles.stock}>Stock disponible: {product.stock}</Text>
      </View>
      <Pressable onPress={onAdd} style={styles.addButton}>
        <Image source={plusIcon} style={styles.icon} />
        <Text style={styles.addText}>Agregar</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: palette.surface,
    borderColor: palette.border,
    borderRadius: radius.md,
    borderWidth: 1,
    gap: spacing.md,
    justifyContent: 'space-between',
    padding: spacing.lg,
  },
  copy: {
    gap: 8,
  },
  name: {
    color: palette.primary,
    fontSize: 20,
    fontWeight: '800',
  },
  description: {
    color: palette.textMuted,
    fontSize: 14,
    lineHeight: 20,
  },
  price: {
    color: palette.text,
    fontSize: 18,
    fontWeight: '700',
  },
  stock: {
    color: palette.accent,
    fontSize: 13,
    fontWeight: '700',
  },
  addButton: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: palette.surfaceAlt,
    borderRadius: radius.pill,
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  icon: {
    height: 16,
    tintColor: palette.primary,
    width: 16,
  },
  addText: {
    color: palette.primary,
    fontSize: 14,
    fontWeight: '800',
  },
});

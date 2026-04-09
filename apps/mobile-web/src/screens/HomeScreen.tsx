import { StyleSheet, Text, View } from 'react-native';
import { ProductCard } from '../components/ProductCard';
import { palette, radius, spacing } from '../theme';
import type { Product } from '../types';

type Props = {
  products: Product[];
  loading: boolean;
  onAddProduct: (product: Product) => void;
};

export function HomeScreen({ products, loading, onAddProduct }: Props) {
  return (
    <View style={styles.layout}>
      <View style={styles.heroCard}>
        <Text style={styles.heroTitle}>Descubre nuestros productos</Text>
      </View>
      <View style={styles.list}>
        {loading ? (
          <Text style={styles.placeholder}>Cargando productos...</Text>
        ) : products.length === 0 ? (
          <Text style={styles.placeholder}>No hay productos disponibles en este momento.</Text>
        ) : (
          products.map((product) => (
            <ProductCard key={product.idProducto} product={product} onAdd={() => onAddProduct(product)} />
          ))
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  layout: {
    gap: spacing.lg,
  },
  heroCard: {
    backgroundColor: palette.primary,
    borderRadius: radius.lg,
    gap: spacing.sm,
    padding: spacing.xl,
  },
  heroTitle: {
    color: palette.surface,
    fontSize: 28,
    fontWeight: '800',
  },
  list: {
    gap: spacing.md,
  },
  placeholder: {
    color: palette.textMuted,
    fontSize: 15,
  },
});

import { Pressable, StyleSheet, Text, View } from 'react-native';
import { palette, radius, spacing } from '../theme';

type Props = {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
};

export function QuantitySelector({ value, onChange, min = 1, max = 999 }: Props) {
  return (
    <View style={styles.container}>
      <Pressable onPress={() => onChange(Math.max(min, value - 1))} style={styles.button}>
        <Text style={styles.symbol}>-</Text>
      </Pressable>
      <Text style={styles.value}>{value}</Text>
      <Pressable onPress={() => onChange(Math.min(max, value + 1))} style={styles.button}>
        <Text style={styles.symbol}>+</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: palette.background,
    borderColor: palette.border,
    borderRadius: radius.pill,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'space-between',
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
  },
  button: {
    alignItems: 'center',
    backgroundColor: palette.surfaceAlt,
    borderRadius: radius.pill,
    height: 34,
    justifyContent: 'center',
    width: 34,
  },
  symbol: {
    color: palette.primary,
    fontSize: 20,
    fontWeight: '700',
  },
  value: {
    color: palette.text,
    fontSize: 16,
    fontWeight: '700',
    minWidth: 30,
    textAlign: 'center',
  },
});

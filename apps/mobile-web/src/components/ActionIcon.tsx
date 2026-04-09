import { Image, Pressable, StyleSheet } from 'react-native';
import { palette, radius } from '../theme';

type Props = {
  source: any;
  onPress: () => void;
};

export function ActionIcon({ source, onPress }: Props) {
  return (
    <Pressable onPress={onPress} style={styles.button}>
      <Image source={source} style={styles.icon} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: palette.surfaceAlt,
    borderRadius: radius.sm,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  icon: {
    height: 18,
    resizeMode: 'contain',
    tintColor: palette.primary,
    width: 18,
  },
});

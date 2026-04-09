import { StyleSheet, Text } from 'react-native';
import { palette } from '../theme';

type Props = {
  text?: string;
  tone?: 'error' | 'success';
};

export function MessageBanner({ text, tone = 'error' }: Props) {
  if (!text) {
    return null;
  }

  return <Text style={[styles.text, tone === 'success' ? styles.success : styles.error]}>{text}</Text>;
}

const styles = StyleSheet.create({
  text: {
    fontSize: 14,
    marginTop: 10,
  },
  error: {
    color: palette.danger,
  },
  success: {
    color: palette.accent,
  },
});

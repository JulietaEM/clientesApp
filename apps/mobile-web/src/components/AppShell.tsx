import { ReactNode, useState } from 'react';
import {
  Image,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { palette, radius, spacing } from '../theme';
import { useResponsive } from '../hooks/useResponsive';
import type { ClientSession, PrivateRoute } from '../types';

const logoutIcon = require('../../assets/logoutIcon.png');

type Props = {
  title: string;
  route: PrivateRoute;
  session: ClientSession;
  onNavigate: (route: PrivateRoute) => void;
  onLogout: () => void;
  children: ReactNode;
};

export function AppShell({ title, route, session, onNavigate, onLogout, children }: Props) {
  const [menuVisible, setMenuVisible] = useState(false);
  const { isDesktop, contentWidth } = useResponsive();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.backgroundShapeTop} />
      <View style={styles.backgroundShapeBottom} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.wrapper, { width: contentWidth }]}>
          <View style={styles.topBar}>
            <View>
              <Text style={styles.eyebrow}>Mobiliario de hogar</Text>
              <Text style={styles.title}>{title}</Text>
            </View>
            <Pressable onPress={() => setMenuVisible(true)} style={styles.menuButton}>
              <Text style={styles.menuButtonText}>Menú</Text>
            </Pressable>
          </View>
          <View style={[styles.content, isDesktop && styles.contentDesktop]}>{children}</View>
        </View>
      </ScrollView>

      <Modal animationType="fade" transparent visible={menuVisible} onRequestClose={() => setMenuVisible(false)}>
        <Pressable style={styles.overlay} onPress={() => setMenuVisible(false)}>
          <Pressable style={styles.drawer} onPress={() => undefined}>
            <View style={styles.drawerTop}>
              <Text style={styles.drawerName}>
                {session.nombreCliente} {session.apellido}
              </Text>
              <Text style={styles.drawerMeta}>@{session.usuario}</Text>
              <Text style={styles.drawerMeta}>{session.correo}</Text>
            </View>
            <View style={styles.drawerMiddle}>
              <Pressable
                onPress={() => {
                  onNavigate('home');
                  setMenuVisible(false);
                }}
                style={[styles.drawerLink, route === 'home' && styles.drawerLinkActive]}
              >
                <Text style={[styles.drawerLinkText, route === 'home' && styles.drawerLinkTextActive]}>Home</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  onNavigate('compra');
                  setMenuVisible(false);
                }}
                style={[styles.drawerLink, route === 'compra' && styles.drawerLinkActive]}
              >
                <Text style={[styles.drawerLinkText, route === 'compra' && styles.drawerLinkTextActive]}>
                  Compra
                </Text>
              </Pressable>
            </View>
            <Pressable
              onPress={() => {
                setMenuVisible(false);
                onLogout();
              }}
              style={styles.logoutRow}
            >
              <Image source={logoutIcon} style={styles.logoutIcon} />
              <Text style={styles.logoutText}>Cerrar sesión</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: palette.background,
    flex: 1,
  },
  backgroundShapeTop: { //Decoración en top
    backgroundColor: palette.surfaceAlt,
    borderBottomRightRadius: 120,
    height: 220,
    left: -80,
    position: 'absolute',
    top: -40,
    width: 240,
  },
  backgroundShapeBottom: { //Decoración en bottom
    backgroundColor: '#E7F5E4',
    borderRadius: 120,
    bottom: -60,
    height: 220,
    position: 'absolute',
    right: -50,
    width: 220,
  },
  scrollContent: {
    flexGrow: 1,
    paddingVertical: spacing.xl,
  },
  wrapper: {
    alignSelf: 'center',
    gap: spacing.lg,
  },
  topBar: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  eyebrow: {
    color: palette.accent,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  title: {
    color: palette.primary,
    fontSize: 28,
    fontWeight: '800',
    marginTop: 6,
  },
  menuButton: {
    backgroundColor: palette.primary,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
  },
  menuButtonText: {
    color: palette.surface,
    fontSize: 14,
    fontWeight: '700',
  },
  content: {
    gap: spacing.lg,
  },
  contentDesktop: {
    gap: spacing.xl,
  },
  overlay: {
    alignItems: 'flex-end',
    backgroundColor: palette.overlay,
    flex: 1,
    justifyContent: 'flex-start',
    padding: spacing.lg,
  },
  drawer: {
    backgroundColor: palette.surface,
    borderRadius: radius.lg,
    gap: spacing.lg,
    marginTop: 50,
    padding: spacing.lg,
    width: 300,
  },
  drawerTop: {
    backgroundColor: palette.surfaceAlt,
    borderRadius: radius.md,
    gap: 6,
    padding: spacing.md,
  },
  drawerName: {
    color: palette.primary,
    fontSize: 20,
    fontWeight: '800',
  },
  drawerMeta: {
    color: palette.textMuted,
    fontSize: 14,
  },
  drawerMiddle: {
    gap: spacing.sm,
  },
  drawerLink: {
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  drawerLinkActive: {
    backgroundColor: palette.surfaceAlt,
  },
  drawerLinkText: {
    color: palette.text,
    fontSize: 16,
    fontWeight: '600',
  },
  drawerLinkTextActive: {
    color: palette.primary,
  },
  logoutRow: {
    alignItems: 'center',
    borderTopColor: palette.border,
    borderTopWidth: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    paddingTop: spacing.md,
  },
  logoutIcon: {
    height: 18,
    tintColor: palette.danger,
    width: 18,
  },
  logoutText: {
    color: palette.danger,
    fontSize: 15,
    fontWeight: '700',
  },
});

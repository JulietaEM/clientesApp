import { useWindowDimensions } from 'react-native';

//Para conocer si es un móvil, tablet o desktop
export function useResponsive() {
  const { width } = useWindowDimensions();

  return {
    isDesktop: width >= 960,
    isTablet: width >= 720,
    contentWidth: width >= 1100 ? 1080 : width >= 720 ? width - 48 : width - 24,
  };
}

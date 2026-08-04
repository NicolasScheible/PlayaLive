import { useEffect, useState } from 'react';
import { AccessibilityInfo, Animated, StyleSheet } from 'react-native';

import { theme } from '../theme/theme';

// Generischer Skeleton-Loader-Baustein (docs/DesignSystem.md nennt kein Muster für Ladezustände,
// da alle Mockup-Screens bereits befüllt sind — hier als naheliegende, dezente Umsetzung von „Große,
// klare Karten"/„hochwertige Animationen" ohne konkrete Vorgabe). Pulsiert dezent zwischen zwei
// Opazitätsstufen; respektiert „Einstellungen > Bewegung reduzieren" (docs/DesignSystem.md Kapitel 22
// „Reduced-Motion-Unterstützung" als offener Punkt — hier bereits berücksichtigt statt aufgeschoben).
type SkeletonBlockProps = {
  width: number | `${number}%`;
  height: number;
  borderRadius?: number;
};

export function SkeletonBlock({
  width,
  height,
  borderRadius = theme.radius.card,
}: SkeletonBlockProps) {
  const [opacity] = useState(() => new Animated.Value(0.4));
  const [reduceMotionEnabled, setReduceMotionEnabled] = useState(false);

  useEffect(() => {
    let isMounted = true;

    AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      if (isMounted) {
        setReduceMotionEnabled(enabled);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (reduceMotionEnabled) {
      opacity.setValue(0.6);

      return;
    }

    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.9, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: 700, useNativeDriver: true }),
      ]),
    );

    animation.start();

    return () => animation.stop();
  }, [opacity, reduceMotionEnabled]);

  return (
    <Animated.View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[styles.base, { width, height, borderRadius, opacity }]}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: theme.colors.border.subtle,
  },
});

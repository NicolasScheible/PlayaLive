import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { Animated, Dimensions, PanResponder, Pressable, StyleSheet, View } from 'react-native';

import { theme } from '../theme/theme';

// Generischer Bottom Sheet mit Drag-Handle (docs/DesignSystem.md Kapitel 17: „Bottom Sheet mit
// Drag-Handle"; exakte Höhen-Stufen/Snap-Points sind dort als offene Designentscheidung markiert —
// hier mit einer einzigen, plausiblen maximalen Höhe umgesetzt statt mehrerer Snap-Stufen). Baut
// bewusst auf React Natives Kern-`Animated`/`PanResponder` statt einer zusätzlichen Bibliothek (kein
// `@gorhom/bottom-sheet` o. Ä.) — dieselbe `Animated`-API wird bereits in `SkeletonBlock.tsx`
// verwendet. Reine Präsentationskomponente: `visible`/`onClose` steuern den Zustand, keine
// Geschäftslogik/kein Datenzugriff.
const DISMISS_DISTANCE_PX = 120;
const DISMISS_VELOCITY = 0.5;
const ANIMATION_DURATION_MS = 250;

type BottomSheetProps = {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
};

export function BottomSheet({ visible, onClose, children }: BottomSheetProps) {
  if (!visible) {
    return null;
  }

  return <BottomSheetPanel onClose={onClose}>{children}</BottomSheetPanel>;
}

function BottomSheetPanel({ onClose, children }: { onClose: () => void; children: ReactNode }) {
  const screenHeight = Dimensions.get('window').height;
  const [translateY] = useState(() => new Animated.Value(screenHeight));

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: 0,
      duration: ANIMATION_DURATION_MS,
      useNativeDriver: true,
    }).start();
  }, [translateY]);

  const [panResponder] = useState(() =>
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dy) > 5,
      onPanResponderMove: (_, gesture) => {
        if (gesture.dy > 0) {
          translateY.setValue(gesture.dy);
        }
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dy > DISMISS_DISTANCE_PX || gesture.vy > DISMISS_VELOCITY) {
          onClose();

          return;
        }

        Animated.timing(translateY, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start();
      },
    }),
  );

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      <Pressable
        testID="bottom-sheet-backdrop"
        accessibilityRole="button"
        accessibilityLabel="Schließen"
        style={styles.backdrop}
        onPress={onClose}
      />
      <Animated.View
        accessibilityViewIsModal
        style={[styles.sheet, { transform: [{ translateY }] }]}
      >
        <View
          {...panResponder.panHandlers}
          style={styles.dragHandleArea}
          testID="bottom-sheet-drag-handle-area"
        >
          <View style={styles.dragHandle} />
        </View>
        {children}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: theme.colors.overlay.scrim,
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    maxHeight: '70%',
    backgroundColor: theme.colors.background.base,
    borderTopLeftRadius: theme.radius.card,
    borderTopRightRadius: theme.radius.card,
    borderWidth: 1,
    borderColor: theme.colors.border.subtle,
    paddingBottom: theme.spacing.lg,
  },
  dragHandleArea: {
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
  },
  dragHandle: {
    width: 40,
    height: 4,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.border.subtle,
  },
});

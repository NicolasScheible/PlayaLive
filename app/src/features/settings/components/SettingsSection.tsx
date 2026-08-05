import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { SectionHeader } from '../../../components/SectionHeader';
import { theme } from '../../../theme/theme';

// Bereichs-Wrapper für die fünf Settings-Bereiche (Auftrag Punkt 1: Konto/App/Datenschutz/Support/
// Rechtliches) — bestehendes `SectionHeader` wiederverwendet, `SettingsRow`-Kinder in einer Karte
// gruppiert. Ab der 3. Verwendung innerhalb desselben Screens extrahiert (CLAUDE.md „ab der 3.
// Verwendung") — hier fünfmal im selben Screen benötigt.
type SettingsSectionProps = {
  title: string;
  children: ReactNode;
};

export function SettingsSection({ title, children }: SettingsSectionProps) {
  return (
    <View>
      <SectionHeader title={title} />
      <View style={styles.list}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: theme.spacing.md,
  },
});

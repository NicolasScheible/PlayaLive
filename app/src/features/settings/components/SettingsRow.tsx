import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';

import { theme } from '../../../theme/theme';

// Generische Einstellungs-Listenzeile (docs/DesignSystem.md Kapitel 18 „Kompakte Listenzeile ... durch
// dünne Trennlinien/Abstand statt Cards getrennt", analog zu `ReviewListItem.tsx`/
// `OwnReportListItem.tsx`). Wiederverwendet für alle Einträge in allen fünf Bereichen (Konto/App/
// Datenschutz/Support/Rechtliches) — mit `onPress` navigierbar/tappbar (Chevron-Glyph, gleiche
// „Glyph statt Icon-Asset"-Konvention wie `IconButton.tsx`), ohne `onPress` rein informativ (z. B.
// Dark Mode: nur Anzeige). `toggle` ergänzt eine Ein/Aus-Zeile (Push-Notification-Feature, Auftrag
// Punkt 7 „Benachrichtigungen: Ein/Aus") über das native `Switch` — keine neue Toggle-Komponente,
// gefärbt mit den bereits entschiedenen `brand.primary`/`border.subtle`-Tokens, keine neuen Farben.
type SettingsRowProps = {
  label: string;
  value?: string;
  onPress?: () => void;
  toggle?: { value: boolean; onValueChange: (value: boolean) => void; disabled?: boolean };
};

export function SettingsRow({ label, value, onPress, toggle }: SettingsRowProps) {
  const content = (
    <>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.trailing}>
        {value ? <Text style={styles.value}>{value}</Text> : null}
        {toggle ? (
          <Switch
            value={toggle.value}
            onValueChange={toggle.onValueChange}
            disabled={toggle.disabled}
            trackColor={{ false: theme.colors.border.subtle, true: theme.colors.brand.primary }}
            accessibilityLabel={label}
          />
        ) : null}
        {onPress ? <Text style={styles.chevron}>›</Text> : null}
      </View>
    </>
  );

  if (onPress) {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        onPress={onPress}
        style={styles.row}
      >
        {content}
      </Pressable>
    );
  }

  if (toggle) {
    return <View style={styles.row}>{content}</View>;
  }

  return (
    <View style={styles.row} accessible accessibilityLabel={value ? `${label}: ${value}` : label}>
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.subtle,
  },
  label: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.body.fontSize,
  },
  trailing: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  value: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.body.fontSize,
  },
  chevron: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.title.fontSize,
  },
});

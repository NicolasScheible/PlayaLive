import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import type { TextInputProps } from 'react-native';

import { theme } from '../theme/theme';

// Generisches Eingabefeld, angelehnt an das in docs/DesignSystem.md Kapitel 13 „Inputs" für Such-/
// Eingabefelder entschiedene Pill-Form (dunkel gefüllt). Der konkrete Feld-Stil für tatsächliche
// Formulareingaben (Login/Registrierung) ist dort ausdrücklich als offene Designentscheidung markiert,
// da die Mockups nur den Button-Einstieg „Mit E-Mail anmelden" zeigen — dieses Feld überträgt das
// bestätigte Pill-Muster als naheliegendste Konsistenzwahl.
type TextFieldProps = Pick<
  TextInputProps,
  | 'value'
  | 'onChangeText'
  | 'placeholder'
  | 'secureTextEntry'
  | 'keyboardType'
  | 'autoCapitalize'
  | 'autoComplete'
  | 'textContentType'
  | 'multiline'
> & {
  label: string;
  error?: string;
};

export function TextField({ label, error, secureTextEntry, ...inputProps }: TextFieldProps) {
  const [isValueVisible, setIsValueVisible] = useState(false);
  // Sichtbarkeits-Umschalter gilt ausschließlich echten Passwortfeldern (`secureTextEntry`) — alle
  // anderen Felder (E-Mail, mehrzeilig, ...) bleiben unverändert. Textlabel statt Augen-Icon: die App
  // nutzt bewusst keine Icon-Bibliothek (siehe IconButton.tsx-Kommentar „keine neue Abhängigkeit"),
  // Glyphen sind dort nur für einzelne, bereits im DesignSystem dokumentierte Fälle (☰/⌕) entschieden.
  const canToggleVisibility = secureTextEntry === true;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputWrapper}>
        <TextInput
          {...inputProps}
          accessibilityLabel={label}
          secureTextEntry={canToggleVisibility ? !isValueVisible : secureTextEntry}
          style={[
            styles.input,
            canToggleVisibility ? styles.inputWithToggle : null,
            error ? styles.inputError : null,
          ]}
          placeholderTextColor={theme.colors.text.secondary}
        />
        {canToggleVisibility ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={isValueVisible ? 'Passwort verbergen' : 'Passwort anzeigen'}
            hitSlop={theme.spacing.sm}
            onPress={() => setIsValueVisible((visible) => !visible)}
            style={styles.toggle}
          >
            <Text style={styles.toggleLabel}>{isValueVisible ? 'Verbergen' : 'Anzeigen'}</Text>
          </Pressable>
        ) : null}
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.xs,
  },
  label: {
    fontSize: theme.typography.label.fontSize,
    fontWeight: theme.typography.label.fontWeight,
    color: theme.colors.text.primary,
  },
  inputWrapper: {
    justifyContent: 'center',
  },
  input: {
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    borderColor: theme.colors.border.subtle,
    backgroundColor: theme.colors.surface.input,
    paddingVertical: theme.spacing.sm + 2,
    paddingHorizontal: theme.spacing.md,
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text.primary,
  },
  // Genug Raum rechts, damit der Umschalter-Text („Anzeigen"/„Verbergen") nicht mit eingegebenem Text
  // überlappt.
  inputWithToggle: {
    paddingRight: 88,
  },
  inputError: {
    borderColor: theme.colors.status.high,
  },
  toggle: {
    position: 'absolute',
    right: theme.spacing.md,
  },
  toggleLabel: {
    fontSize: theme.typography.caption.fontSize,
    fontWeight: theme.typography.label.fontWeight,
    color: theme.colors.brand.primary,
  },
  errorText: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.status.high,
    paddingHorizontal: theme.spacing.sm,
  },
});

import { StyleSheet, Text, TextInput, View } from 'react-native';
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
> & {
  label: string;
  error?: string;
};

export function TextField({ label, error, ...inputProps }: TextFieldProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        {...inputProps}
        style={[styles.input, error ? styles.inputError : null]}
        placeholderTextColor={theme.colors.text.secondary}
      />
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
  input: {
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    borderColor: theme.colors.border.subtle,
    backgroundColor: theme.colors.background.base,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text.primary,
  },
  inputError: {
    borderColor: theme.colors.status.high,
  },
  errorText: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.status.high,
    paddingHorizontal: theme.spacing.sm,
  },
});

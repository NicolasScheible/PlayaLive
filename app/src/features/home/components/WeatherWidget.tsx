import { StyleSheet, Text, View } from 'react-native';

import { ErrorState } from '../../../components/ErrorState';
import { SkeletonBlock } from '../../../components/SkeletonBlock';
import type { AppError } from '../../../lib/errors';
import type { WeatherSnapshot } from '../../../services/WeatherService';
import { theme } from '../../../theme/theme';

// Wetter-Widget gemäß docs/PRD.md Kapitel 10/17 „Große, fette Zahlen/Headlines für zentrale Werte
// (z. B. Temperatur „28°")". Zeigt bewusst nur die vom kompakten Home-Widget benötigten Felder
// (Temperatur, gefühlte Temperatur, Zustand, Luftfeuchtigkeit, Wind) — Regenwahrscheinlichkeit/
// UV-Index/Sonnenauf-/-untergang gehören zum separaten Wetter-Detailscreen (nicht Teil dieses
// Auftrags), siehe supabase/functions/weather/index.ts.
type WeatherWidgetProps = {
  weather: WeatherSnapshot | null;
  isLoading: boolean;
  isError: boolean;
  error: AppError | null;
};

export function WeatherWidget({ weather, isLoading, isError, error }: WeatherWidgetProps) {
  if (isLoading) {
    return <SkeletonBlock width="100%" height={100} />;
  }

  if (isError) {
    return <ErrorState message={error?.message ?? 'Das Wetter konnte nicht geladen werden.'} />;
  }

  if (!weather) {
    return null;
  }

  return (
    <View
      style={styles.container}
      accessibilityRole="text"
      accessibilityLabel={`Wetter: ${weather.temperatureCelsius} Grad, ${weather.condition}`}
    >
      <Text style={styles.temperature}>{weather.temperatureCelsius}°</Text>
      <View style={styles.details}>
        <Text style={styles.condition}>{weather.condition}</Text>
        <Text style={styles.meta}>Gefühlt {weather.feelsLikeCelsius}°</Text>
        <Text style={styles.meta}>
          {weather.humidityPercent}% Luftfeuchtigkeit · {weather.windSpeedKmh} km/h Wind
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    marginHorizontal: theme.spacing.md,
    padding: theme.spacing.md,
    borderRadius: theme.radius.card,
    borderWidth: 1,
    borderColor: theme.colors.border.subtle,
  },
  temperature: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.hero.fontSize,
    fontWeight: theme.typography.hero.fontWeight,
  },
  details: {
    gap: 2,
  },
  condition: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.body.fontSize,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  meta: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.caption.fontSize,
  },
});

import { StyleSheet, Text, View } from 'react-native';

import { theme } from '../../../theme/theme';

// Statistik-Übersicht gemäß Auftrag Punkt 1: Trust Score, Anzahl Reports, Anzahl Reviews, Anzahl
// Favoriten — alle vier Werte existieren im Datenmodell (`profiles.trust_score`/`reports_count`, Anzahl
// eigener Reviews/Favoriten über die bestehenden Services), daher durchgängig angezeigt („nur falls
// vorhanden" trifft hier auf keinen der vier Werte zu). Reine Text-Statistik statt eines neuen
// Badge-/Card-Bausteins — DesignSystem kennt kein eigenes Muster für Zahlen-Statistiken außerhalb der
// bereits vergebenen `hero`-Typografie (Kapitel 4: „Große, fette Zahlen ... für zentrale Werte").
type ProfileStatsSectionProps = {
  trustScore: number;
  reportsCount: number;
  reviewsCount: number;
  favoritesCount: number;
};

export function ProfileStatsSection({
  trustScore,
  reportsCount,
  reviewsCount,
  favoritesCount,
}: ProfileStatsSectionProps) {
  const stats = [
    { label: 'Trust Score', value: trustScore },
    { label: 'Reports', value: reportsCount },
    { label: 'Reviews', value: reviewsCount },
    { label: 'Favoriten', value: favoritesCount },
  ];

  return (
    <View style={styles.container}>
      {stats.map((stat) => (
        <View
          key={stat.label}
          style={styles.stat}
          accessible
          accessibilityLabel={`${stat.value} ${stat.label}`}
        >
          <Text style={styles.value}>{stat.value}</Text>
          <Text style={styles.label}>{stat.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
  },
  stat: {
    alignItems: 'center',
    gap: 2,
  },
  value: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.title.fontSize,
    fontWeight: theme.typography.title.fontWeight,
  },
  label: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.caption.fontSize,
  },
});

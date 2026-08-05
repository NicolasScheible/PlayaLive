import type { Weekday } from '../types/entities';

// Deutsche Anzeigenamen für das `weekday`-Enum (supabase/migrations/20260804122736_happy_hours.sql).
// Zentralisiert ab der 3. Verwendung (CLAUDE.md → Code-Qualität „ab 3. Verwendung") — zuvor identisch
// dupliziert in HappyHoursSection.tsx und LocationBottomSheetContent.tsx.
export const WEEKDAY_LABELS: Record<Weekday, string> = {
  monday: 'Montag',
  tuesday: 'Dienstag',
  wednesday: 'Mittwoch',
  thursday: 'Donnerstag',
  friday: 'Freitag',
  saturday: 'Samstag',
  sunday: 'Sonntag',
};

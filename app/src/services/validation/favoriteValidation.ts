import type { FavoriteTargetType } from '../../types/entities';

// Clientseitige Vorabvalidierung für Favoriten — spiegelt `favorite_target_type` aus
// supabase/migrations/20260804122728_favorites.sql. Die eigentliche Existenzprüfung der Zielressource
// übernimmt der Datenbank-Trigger `validate_favorite_target()`, nicht das Frontend.
const FAVORITE_TARGET_TYPES: readonly FavoriteTargetType[] = ['location', 'artist', 'event'];

export function isValidFavoriteTargetType(value: string): value is FavoriteTargetType {
  return (FAVORITE_TARGET_TYPES as readonly string[]).includes(value);
}

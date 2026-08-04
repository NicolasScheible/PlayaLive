import type { AppError } from '../lib/errors';
import { mapDatabaseError } from '../lib/errors';
import { supabase } from '../lib/supabase';
import type { CreateFavoriteInput } from '../types/dto';
import type { Favorite, FavoriteTargetType } from '../types/entities';

import { AuthService } from './AuthService';
import { isValidFavoriteTargetType } from './validation/favoriteValidation';

// Service Layer für Favoriten (siehe docs/Architecture.md Kapitel 8, docs/API.md Kapitel 7). Ohne
// Repository-Schicht (docs/Architecture.md Kapitel 9). Nutzer-ID kommt ausschließlich über
// `AuthService.getSession()` — direkte `supabase.auth`-Aufrufe sind laut Architekturentscheidung nur
// im AuthService erlaubt (siehe app/src/services/AuthService.ts).
async function requireUserId(): Promise<string> {
  const { session } = await AuthService.getSession();

  if (!session) {
    const error: AppError = {
      code: 'AUTH_SESSION_MISSING',
      messageKey: 'errors.auth.AUTH_SESSION_MISSING',
      message: 'Du musst angemeldet sein, um diese Aktion auszuführen.',
      technicalMessage: 'No active session',
    };
    throw error;
  }

  return session.user.id;
}

export const FavoriteService = {
  async addFavorite(input: CreateFavoriteInput): Promise<Favorite> {
    if (!isValidFavoriteTargetType(input.targetType)) {
      const error: AppError = {
        code: 'FAVORITE_INVALID_TARGET',
        messageKey: 'errors.database.FAVORITE_INVALID_TARGET',
        message: 'Dieser Eintrag kann nicht favorisiert werden.',
        technicalMessage: `Invalid target_type: ${input.targetType}`,
      };
      throw error;
    }

    const userId = await requireUserId();

    const { data, error } = await supabase
      .from('favorites')
      .insert({ user_id: userId, target_type: input.targetType, target_id: input.targetId })
      .select('*')
      .single();

    if (error) {
      throw mapDatabaseError(error);
    }

    return data;
  },

  async removeFavorite(targetType: FavoriteTargetType, targetId: string): Promise<void> {
    const userId = await requireUserId();

    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('target_type', targetType)
      .eq('target_id', targetId);

    if (error) {
      throw mapDatabaseError(error);
    }
  },

  // docs/API.md Kapitel 7: „toggleFavorite(type, id)".
  async toggleFavorite(targetType: FavoriteTargetType, targetId: string): Promise<boolean> {
    const userId = await requireUserId();

    const { data: existing, error: selectError } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', userId)
      .eq('target_type', targetType)
      .eq('target_id', targetId)
      .maybeSingle();

    if (selectError) {
      throw mapDatabaseError(selectError);
    }

    if (existing) {
      await this.removeFavorite(targetType, targetId);

      return false;
    }

    await this.addFavorite({ targetType, targetId });

    return true;
  },

  async getFavorites(targetType?: FavoriteTargetType): Promise<Favorite[]> {
    const userId = await requireUserId();

    let query = supabase.from('favorites').select('*').eq('user_id', userId);

    if (targetType) {
      query = query.eq('target_type', targetType);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      throw mapDatabaseError(error);
    }

    return data;
  },
};

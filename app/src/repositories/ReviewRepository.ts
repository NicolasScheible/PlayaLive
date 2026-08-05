import { supabase } from '../lib/supabase';
import type { Database } from '../types/database';
import type { GetReviewsFilters } from '../types/dto';
import type { Review, ReviewFlag } from '../types/entities';

// Repository-Schicht für Reviews (siehe docs/Architecture.md Kapitel 9 „Repository Pattern"): kapselt
// ausschließlich den Datenzugriff, keine Business-Logik und keine Fehlerübersetzung — das übernimmt
// ReviewService.ts. Reviews gehören laut Architekturentscheidung 5 zu den Services mit
// Repository-Schicht.
export const ReviewRepository = {
  async insertReview(row: Database['public']['Tables']['reviews']['Insert']): Promise<Review> {
    const { data, error } = await supabase.from('reviews').insert(row).select('*').single();

    if (error) {
      throw error;
    }

    return data;
  },

  async updateReview(
    id: string,
    row: Database['public']['Tables']['reviews']['Update'],
  ): Promise<Review> {
    const { data, error } = await supabase
      .from('reviews')
      .update(row)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      throw error;
    }

    return data;
  },

  // docs/API.md Kapitel 9: sortierbar nach „Neueste" oder „Hilfreichste" — „Hilfreichste" ist laut
  // docs/PRD.md Kapitel 22 „Offene Punkte" noch ungeklärt (siehe GetReviewsFilters in types/dto.ts),
  // daher hier ausschließlich „Neueste" (created_at absteigend) umgesetzt.
  async findByTarget(filters: GetReviewsFilters): Promise<Review[]> {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('target_type', filters.targetType)
      .eq('target_id', filters.targetId)
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data;
  },

  // docs/API.md Kapitel 9 „Eigene Bewertungen abrufen" — nach demselben Muster wie
  // `ReportRepository.findOwnReports` (Filter nach `user_id` statt Ziel).
  async findByUser(userId: string): Promise<Review[]> {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('user_id', userId)
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data;
  },

  async insertReviewFlag(
    row: Database['public']['Tables']['review_flags']['Insert'],
  ): Promise<ReviewFlag> {
    const { data, error } = await supabase.from('review_flags').insert(row).select('*').single();

    if (error) {
      throw error;
    }

    return data;
  },
};

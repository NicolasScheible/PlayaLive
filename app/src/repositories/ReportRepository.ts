import { supabase } from '../lib/supabase';
import type { Database } from '../types/database';
import type { LocationLiveStatus, Report, ReportFlag } from '../types/entities';

// Repository-Schicht für Reports (siehe docs/Architecture.md Kapitel 9 „Repository Pattern",
// docs/ADR/005-API-Architecture.md): kapselt ausschließlich den Datenzugriff, keine Business-Logik
// und keine Fehlerübersetzung — das übernimmt ReportService.ts. Reports gehören laut
// Architekturentscheidung 5 zu den Services mit Repository-Schicht (komplexe Business-Logik/
// Community-Aggregation).
export const ReportRepository = {
  async insertReport(row: Database['public']['Tables']['reports']['Insert']): Promise<Report> {
    const { data, error } = await supabase.from('reports').insert(row).select('*').single();

    if (error) {
      throw error;
    }

    return data;
  },

  async findOwnReports(userId: string): Promise<Report[]> {
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data;
  },

  async findLiveStatus(locationId: string): Promise<LocationLiveStatus | null> {
    const { data, error } = await supabase
      .from('location_live_status')
      .select('*')
      .eq('location_id', locationId)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data;
  },

  async insertReportFlag(
    row: Database['public']['Tables']['report_flags']['Insert'],
  ): Promise<ReportFlag> {
    const { data, error } = await supabase.from('report_flags').insert(row).select('*').single();

    if (error) {
      throw error;
    }

    return data;
  },
};

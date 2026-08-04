import type { RealtimeChannel } from '@supabase/supabase-js';

import { supabase } from '../lib/supabase';
import type { Report } from '../types/entities';

// Zentraler Realtime Service gemäß docs/ADR/003-Realtime.md: „Realtime-Abonnements laufen
// ausschließlich über einen zentralen Realtime Service ... Screens/Komponenten kommunizieren niemals
// direkt mit Supabase Realtime." Aktuell ausschließlich `reports` (Live-Auslastung) — weitere,
// ADR-003-benannte Kandidaten (Notifications, Events, Specials/Happy Hours) werden erst aktiviert,
// wenn das jeweilige Feature sie konsumiert (siehe supabase/migrations/20260804122744_enable_realtime_reports.sql).
const REPORT_EVENT_DEBOUNCE_MS = 300;

export const RealtimeService = {
  // docs/ADR/003-Realtime.md „Debouncing": bündelt mehrere kurz aufeinanderfolgende Report-Inserts
  // innerhalb von 300ms zu einem einzigen `onBatch`-Aufruf, statt für jedes einzelne Event eine
  // Cache-Invalidierung/Neuzeichnung auszulösen. Rückgabe: Unsubscribe-Funktion, vom aufrufenden Hook
  // beim Verlassen/Unsichtbarwerden des Screens aufzurufen (ADR-003: „nur sichtbare Screens
  // abonnieren").
  subscribeToReports(onBatch: (reports: Report[]) => void): () => void {
    let debounceTimer: ReturnType<typeof setTimeout> | null = null;
    let pendingReports: Report[] = [];

    function flush() {
      const reports = pendingReports;
      pendingReports = [];
      debounceTimer = null;
      onBatch(reports);
    }

    const channel: RealtimeChannel = supabase
      .channel('reports-live-updates')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'reports' },
        (payload) => {
          pendingReports.push(payload.new as Report);

          if (debounceTimer) {
            clearTimeout(debounceTimer);
          }

          debounceTimer = setTimeout(flush, REPORT_EVENT_DEBOUNCE_MS);
        },
      )
      .subscribe();

    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }

      supabase.removeChannel(channel);
    };
  },
};

-- Fehlender Index auf report_flags.flagged_by_user_id, identifiziert bei der Audit-Prüfung des
-- bestehenden Schemas (20260804122730_reports.sql hatte nur einen Index auf report_id). Analog zum
-- von Beginn an vollständigen Indexpaar bei review_flags (20260804122738_reviews.sql).
create index report_flags_flagged_by_user_id_idx on public.report_flags (flagged_by_user_id);

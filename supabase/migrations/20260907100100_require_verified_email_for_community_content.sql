-- Serverseitige Durchsetzung von docs/ADR/002-Authentication.md „E-Mail-Verifizierung":
-- Verifizierung ist Voraussetzung, um Community-Inhalte (Reports, Reviews) zu veröffentlichen — bislang
-- prüften `reports_insert_own`/`reviews_insert_own` (20260804122730_reports.sql,
-- 20260804122738_reviews.sql) ausschließlich `user_id = auth.uid()`, ohne Verifizierungsprüfung.
--
-- Signal: der native `is_anonymous`-Claim im Access-Token (siehe app/node_modules/@supabase/auth-js
-- lib/types.d.ts → `JwtPayload.is_anonymous`, https://supabase.com/docs/guides/auth/jwt-fields).
-- Registrierung läuft über `AuthService.signUpWithPassword()` zunächst als anonyme Session (ADR-002
-- „sofort nutzbar"); `is_anonymous` wechselt erst mit dem Klick auf den per `updateUser()`
-- verschickten Bestätigungslink auf `false`. Kein eigenes `profiles`-Verifizierungsfeld — der native
-- Supabase-Identitätszustand ist hier die einzige Quelle.
--
-- 🔴 Offener Integrationspunkt: dass `is_anonymous` als Top-Level-Claim im Access-Token dieses Projekts
-- ankommt, ist aus der installierten Client-SDK-Typdefinition abgeleitet, nicht gegen das reale
-- Supabase-Projekt getestet (kein Dashboard-/Datenbankzugriff aus dieser Umgebung). Vor Produktivnahme
-- verifizieren: `select auth.jwt() ->> 'is_anonymous'` nach einem echten `signInAnonymously()`-Aufruf.
drop policy "reports_insert_own" on public.reports;

create policy "reports_insert_own"
  on public.reports for insert
  to authenticated
  with check (user_id = auth.uid() and coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false) is not true);

drop policy "reviews_insert_own" on public.reviews;

create policy "reviews_insert_own"
  on public.reviews for insert
  to authenticated
  with check (user_id = auth.uid() and coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false) is not true);

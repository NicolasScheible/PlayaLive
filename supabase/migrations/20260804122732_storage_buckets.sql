-- Storage-Buckets gemäß docs/PRD.md Kapitel 15 „Storage-Buckets" (Tabelle mit Bucket/Inhalt/
-- Schreibrechten/Leserechten) und docs/Database.md 2.7.
--
-- 🔴 Annahmen, zur Bestätigung durch den Product Owner vorgelegt (in den Dokumenten nicht beziffert):
--   - Maximale Dateigröße: 5 MB je Objekt für alle Buckets.
--   - Akzeptierte Upload-MIME-Types: image/jpeg, image/png, image/webp, image/avif (die dokumentierte
--     automatische Komprimierung/Formatkonvertierung nach WebP/AVIF ist Anwendungslogik, nicht Teil
--     dieser Migration).
--   - Objektpfad-Konvention `<location_id>/...` bzw. `<event_id>/...` bzw. `<user_id>/...` als erstes
--     Pfadsegment — nirgends dokumentiert, aber technisch notwendig, damit die
--     „eigene Location"/„eigene Events"/„eigenes Profil"-Schreibrechte (siehe PRD-Tabelle) überhaupt
--     prüfbar sind.
--   - `specials`-Bucket: Location-Manager-Schreibrecht für „eigene Location" ist noch nicht umgesetzt,
--     da die Tabelle `specials` nicht Teil dieses Schritts ist — vorerst nur Admin/Super Admin.
--   - `system`-Bucket: als vollständig öffentlich (`public = true`) umgesetzt, da PRD „öffentlich" als
--     eine der beiden möglichen Optionen nennt („öffentlich/authentifiziert je nach Inhalt" — eine
--     inhaltsabhängige Feinsteuerung ist auf Bucket-Ebene nicht abbildbar).

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('locations', 'locations', false, 5242880, array['image/jpeg', 'image/png', 'image/webp', 'image/avif']),
  ('artists', 'artists', false, 5242880, array['image/jpeg', 'image/png', 'image/webp', 'image/avif']),
  ('events', 'events', false, 5242880, array['image/jpeg', 'image/png', 'image/webp', 'image/avif']),
  ('profiles', 'profiles', false, 5242880, array['image/jpeg', 'image/png', 'image/webp', 'image/avif']),
  ('specials', 'specials', false, 5242880, array['image/jpeg', 'image/png', 'image/webp', 'image/avif']),
  ('system', 'system', true, 5242880, array['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/x-icon', 'image/svg+xml']);

-- locations: Leserechte „alle authentifizierten Nutzer", Schreibrechte Admin/Super Admin/Location
-- Manager (eigene Location, geprüft über das erste Pfadsegment als location_id).
create policy "storage_locations_select_authenticated"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'locations');

create policy "storage_locations_write_admin_or_owner"
  on storage.objects for all
  to authenticated
  using (
    bucket_id = 'locations'
    and (public.is_admin() or public.is_location_manager_of(((storage.foldername(name))[1])::uuid))
  )
  with check (
    bucket_id = 'locations'
    and (public.is_admin() or public.is_location_manager_of(((storage.foldername(name))[1])::uuid))
  );

-- artists: Leserechte „alle authentifizierten Nutzer", Schreibrechte ausschließlich Admin/Super Admin.
create policy "storage_artists_select_authenticated"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'artists');

create policy "storage_artists_write_admin"
  on storage.objects for all
  to authenticated
  using (bucket_id = 'artists' and public.is_admin())
  with check (bucket_id = 'artists' and public.is_admin());

-- events: Leserechte „alle authentifizierten Nutzer", Schreibrechte Admin/Super Admin/Location
-- Manager (eigene Events, geprüft über die Location des ersten Pfadsegments als event_id).
create policy "storage_events_select_authenticated"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'events');

create policy "storage_events_write_admin_or_owner"
  on storage.objects for all
  to authenticated
  using (
    bucket_id = 'events'
    and (
      public.is_admin()
      or exists (
        select 1 from public.events
        where events.id = ((storage.foldername(name))[1])::uuid
          and public.is_location_manager_of(events.location_id)
      )
    )
  )
  with check (
    bucket_id = 'events'
    and (
      public.is_admin()
      or exists (
        select 1 from public.events
        where events.id = ((storage.foldername(name))[1])::uuid
          and public.is_location_manager_of(events.location_id)
      )
    )
  );

-- profiles: Leserechte „alle authentifizierten Nutzer", Schreibrechte Eigentümer des Profils
-- (erstes Pfadsegment als user_id) oder Admin.
create policy "storage_profiles_select_authenticated"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'profiles');

create policy "storage_profiles_write_owner_or_admin"
  on storage.objects for all
  to authenticated
  using (
    bucket_id = 'profiles'
    and (public.is_admin() or ((storage.foldername(name))[1])::uuid = auth.uid())
  )
  with check (
    bucket_id = 'profiles'
    and (public.is_admin() or ((storage.foldername(name))[1])::uuid = auth.uid())
  );

-- specials: Leserechte „alle authentifizierten Nutzer", Schreibrechte vorerst ausschließlich
-- Admin/Super Admin (siehe Annahme oben — Tabelle `specials` nicht Teil dieses Schritts).
create policy "storage_specials_select_authenticated"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'specials');

create policy "storage_specials_write_admin"
  on storage.objects for all
  to authenticated
  using (bucket_id = 'specials' and public.is_admin())
  with check (bucket_id = 'specials' and public.is_admin());

-- system: Bucket ist `public = true` (Lesezugriff daher bereits ohne Policy über die öffentliche
-- Objekt-URL möglich); Schreibrechte ausschließlich Super Admin (docs/PRD.md Kapitel 15).
create policy "storage_system_select_all"
  on storage.objects for select
  using (bucket_id = 'system');

create policy "storage_system_write_super_admin"
  on storage.objects for all
  to authenticated
  using (bucket_id = 'system' and public.current_user_role() = 'super_admin')
  with check (bucket_id = 'system' and public.current_user_role() = 'super_admin');

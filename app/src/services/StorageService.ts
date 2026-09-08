import type { AppError } from '../lib/errors';
import { mapDatabaseError } from '../lib/errors';
import { supabase } from '../lib/supabase';

import { AuthService } from './AuthService';

// Service Layer für Supabase Storage (siehe docs/Architecture.md Kapitel 8, docs/PRD.md Kapitel 15
// „Storage-Buckets"). Kein Repository (docs/Architecture.md Kapitel 9 — reiner Datei-Upload ohne
// Business-Logik). Der `profiles`-Bucket samt RLS-Policies existiert bereits
// (supabase/migrations/20260804122732_storage_buckets.sql: Leserechte alle authentifizierten Nutzer,
// Schreibrechte ausschließlich Eigentümer/Admin über das erste Pfadsegment als `user_id`) — dieser
// Service ergänzt lediglich den bislang fehlenden Client-Zugriff darauf.
//
// Der `profiles`-Bucket ist `public: false` (bewusste, bestehende Entscheidung, siehe Migration) —
// `getPublicUrl()` liefert dafür keine tatsächlich abrufbare URL. Stattdessen wird eine signierte URL
// mit sehr langer Gültigkeit erzeugt (10 Jahre) und in `profiles.avatar_url` gespeichert, damit sie wie
// jede andere `imageUrl` in den bestehenden Bild-Komponenten (`CardImage`, `ArtistCard`, ...) ohne
// Sonderbehandlung (z. B. Auth-Header) angezeigt werden kann. Dies ist ein pragmatischer, auf dieses
// eine Feld begrenzter Kompromiss — eine allgemeine Lösung für private Storage-Buckets (z. B. signierte
// URLs bei jedem Leseabruf neu erzeugen) ist eine größere, hier nicht beauftragte Architekturfrage, die
// alle Storage-Buckets gleichermaßen beträfe.
const SIGNED_URL_EXPIRY_SECONDS = 10 * 365 * 24 * 60 * 60;
const PROFILES_BUCKET = 'profiles';

export type AvatarAsset = {
  uri: string;
  mimeType: string;
};

function extensionForMimeType(mimeType: string): string {
  const subtype = mimeType.split('/')[1];

  return subtype ?? 'jpg';
}

// `requireUserId()` gemäß demselben Muster wie in FavoriteService.ts/ReportService.ts/ReviewService.ts
// (Nutzer-ID ausschließlich über `AuthService.getSession()`, nie eigene `supabase.auth`-Aufrufe).
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

export const StorageService = {
  // Lädt in `<user_id>/...` hoch (RLS erlaubt Schreibzugriff nur dort) — die Nutzer-ID kommt aus der
  // aktuellen Session, nicht als Parameter, analog zu den übrigen Services.
  async uploadAvatar(asset: AvatarAsset): Promise<string> {
    const userId = await requireUserId();

    let blob: Blob;

    try {
      const response = await fetch(asset.uri);
      blob = await response.blob();
    } catch (error) {
      // Lässt die lokale Bilddatei sich nicht lesen (z. B. ungültige/gelöschte URI aus der
      // Mediathek), soll das dieselbe zugeordnete AppError-Form haben wie jeder andere Fehler
      // dieses Service — sonst würde hier ein roher `TypeError` bis zur UI durchgereicht.
      throw mapDatabaseError(error);
    }

    const path = `${userId}/avatar-${Date.now()}.${extensionForMimeType(asset.mimeType)}`;

    const { error: uploadError } = await supabase.storage
      .from(PROFILES_BUCKET)
      .upload(path, blob, { contentType: asset.mimeType, upsert: true });

    if (uploadError) {
      throw mapDatabaseError(uploadError);
    }

    const { data: signedUrlData, error: signedUrlError } = await supabase.storage
      .from(PROFILES_BUCKET)
      .createSignedUrl(path, SIGNED_URL_EXPIRY_SECONDS);

    if (signedUrlError) {
      throw mapDatabaseError(signedUrlError);
    }

    return signedUrlData.signedUrl;
  },
};

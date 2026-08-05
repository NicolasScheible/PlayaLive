import { useState } from 'react';

import { useFavoriteArtists } from './useFavoriteArtists';
import { useFavoriteEvents } from './useFavoriteEvents';
import { useFavoriteLocations } from './useFavoriteLocations';

export type FavoritesTab = 'location' | 'event' | 'artist';

// Der aktive Tab ist reiner UI-Zustand ohne Bedarf, über den Screen hinaus geteilt oder persistiert zu
// werden — anders als z. B. `filterStore` (Zustand), der Kartenfilter über Screen-Wechsel hinweg erhält.
// Lokaler State genügt (ADR-001: Zustand nur für geteilten/persistenten Client-State). Nur der aktive
// Tab lädt Daten (`enabled`), um unnötige Requests für die beiden inaktiven Tabs zu vermeiden (Auftrag
// Punkt 9 „Keine unnötigen Requests").
export function useFavoritesScreen() {
  const [activeTab, setActiveTab] = useState<FavoritesTab>('location');

  const locations = useFavoriteLocations(activeTab === 'location');
  const events = useFavoriteEvents(activeTab === 'event');
  const artists = useFavoriteArtists(activeTab === 'artist');

  return {
    activeTab,
    setActiveTab,
    locations,
    events,
    artists,
  };
}

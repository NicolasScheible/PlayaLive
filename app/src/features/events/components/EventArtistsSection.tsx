import { Pressable } from 'react-native';

import { ArtistCard } from '../../../components/ArtistCard';
import { EmptyState } from '../../../components/EmptyState';
import { HorizontalCardList } from '../../../components/HorizontalCardList';
import { SectionHeader } from '../../../components/SectionHeader';
import type { Artist } from '../../../types/entities';

// Künstler gemäß Auftrag Punkt 5: „Liste aller beteiligten Artists. Beim Klick Navigation zum Artist
// Detail Screen." Artists kommen bereits aufgelöst mit dem Event (`EventService.getEventById` liefert
// `EventWithDetails.artists`) — kein eigener Lade-/Fehlerzustand nötig, nur ein Empty State ohne
// zugeordnete Artists. Klick-Handling über einen umgebenden `Pressable`, `ArtistCard` bleibt
// unverändert (CLAUDE.md: „kein Refactoring funktionierenden Codes").
type EventArtistsSectionProps = {
  artists: Artist[];
  onPressArtist: (artistId: string) => void;
};

export function EventArtistsSection({ artists, onPressArtist }: EventArtistsSectionProps) {
  return (
    <>
      <SectionHeader title="Künstler" />
      {artists.length === 0 ? (
        <EmptyState message="Für dieses Event sind keine Künstler angegeben." />
      ) : (
        <HorizontalCardList accessibilityLabel="Künstler dieses Events">
          {artists.map((artist) => (
            <Pressable key={artist.id} onPress={() => onPressArtist(artist.id)}>
              <ArtistCard name={artist.name} imageUrl={artist.image_url} genres={artist.genres} />
            </Pressable>
          ))}
        </HorizontalCardList>
      )}
    </>
  );
}

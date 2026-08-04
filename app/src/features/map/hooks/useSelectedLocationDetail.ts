import { useQuery } from '@tanstack/react-query';

import type { UserCoordinates } from '../../../hooks/useUserLocation';
import type { AppError } from '../../../lib/errors';
import { EventService } from '../../../services/EventService';
import { HappyHourService } from '../../../services/HappyHourService';
import { SpecialService } from '../../../services/SpecialService';
import type { Event, HappyHour, LocationWithLiveStatus, Special } from '../../../types/entities';
import { distanceMeters } from '../../../utils/distance';

// Inhalt des Bottom Sheets (Auftrag Punkt 5: „Bild, Name, Kategorie, aktuelle Auslastung, Happy Hours,
// Specials, aktuell laufende Events, Entfernung, Button 'Details'"). Bild/Name/Kategorie/Auslastung
// stecken bereits in `LocationWithLiveStatus` (Übergabe durch den Aufrufer) — dieser Hook ergänzt
// ausschließlich die Daten, die eine eigene Abfrage je ausgewählter Location benötigen.
export function useSelectedLocationDetail(
  selectedLocationId: string | null,
  locations: LocationWithLiveStatus[],
  userCoords: UserCoordinates | null,
) {
  const location = locations.find((candidate) => candidate.id === selectedLocationId) ?? null;
  const isEnabled = selectedLocationId !== null;

  const happyHoursQuery = useQuery<HappyHour[], AppError>({
    queryKey: ['locations', 'activeHappyHours', selectedLocationId],
    queryFn: () => HappyHourService.getActiveHappyHoursForLocation(selectedLocationId as string),
    enabled: isEnabled,
  });

  const specialsQuery = useQuery<Special[], AppError>({
    queryKey: ['locations', 'activeSpecials', selectedLocationId],
    queryFn: () => SpecialService.getActiveSpecialsForLocation(selectedLocationId as string),
    enabled: isEnabled,
  });

  const currentEventsQuery = useQuery<Event[], AppError>({
    queryKey: ['locations', 'currentEvents', selectedLocationId],
    queryFn: () => EventService.getCurrentEvents({ locationId: selectedLocationId as string }),
    enabled: isEnabled,
  });

  if (!location) {
    return null;
  }

  const distance =
    userCoords && location.latitude !== null && location.longitude !== null
      ? distanceMeters(
          userCoords.latitude,
          userCoords.longitude,
          location.latitude,
          location.longitude,
        )
      : null;

  return {
    location,
    distanceMeters: distance,
    activeHappyHours: happyHoursQuery.data ?? [],
    activeSpecials: specialsQuery.data ?? [],
    currentEvents: currentEventsQuery.data ?? [],
    isLoading: happyHoursQuery.isLoading || specialsQuery.isLoading || currentEventsQuery.isLoading,
    isError: happyHoursQuery.isError || specialsQuery.isError || currentEventsQuery.isError,
    error: happyHoursQuery.error ?? specialsQuery.error ?? currentEventsQuery.error ?? null,
  };
}

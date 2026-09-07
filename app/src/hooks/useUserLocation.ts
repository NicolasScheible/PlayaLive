import * as Location from 'expo-location';
import { useCallback, useEffect, useState } from 'react';

// Geteilter, feature-übergreifender Hook (siehe hooks/README.md) — Standort wird sowohl von der
// Live-Karte als auch künftig vom Community-Report-Flow benötigt (docs/Architecture.md Kapitel 17:
// „Die Berechtigung wird erst angefragt, wenn eine Funktion sie tatsächlich benötigt (Live-Karte,
// Community Report, Navigation)").
//
// Fragt beim Mount NIEMALS automatisch die Berechtigung an (docs/Architecture.md Kapitel 17: „fordert
// nie beim ersten Start automatisch eine Standortberechtigung an") — es wird nur der bereits
// bestehende Status gelesen. Das Anfragen selbst (inkl. des vorgeschriebenen kurzen Hinweises vor der
// System-Abfrage) übernimmt die aufrufende UI über `requestPermission()`.
export type LocationPermissionStatus = 'undetermined' | 'granted' | 'denied';

export type UserCoordinates = {
  latitude: number;
  longitude: number;
};

const WATCH_DISTANCE_INTERVAL_METERS = 25;

export function useUserLocation() {
  const [status, setStatus] = useState<LocationPermissionStatus>('undetermined');
  const [coords, setCoords] = useState<UserCoordinates | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    Location.getForegroundPermissionsAsync()
      .then((response) => {
        if (isMounted) {
          setStatus(response.status);
          setIsLoading(false);
        }
      })
      .catch((error) => {
        // Ohne diesen Catch bliebe `isLoading` bei einem Fehler (z. B. Standortdienste auf
        // Systemebene deaktiviert) dauerhaft `true` — Aufrufer würden nie einen nutzbaren Zustand
        // sehen, statt regulär mit `status: 'undetermined'` weiterzumachen.
        console.error('[useUserLocation] getForegroundPermissionsAsync() fehlgeschlagen:', error);

        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (status !== 'granted') {
      return;
    }

    let isMounted = true;
    let subscription: Location.LocationSubscription | undefined;

    Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced })
      .then((position) => {
        if (isMounted) {
          setCoords(position.coords);
        }
      })
      .catch((error) => {
        // Schlägt auf Emulatoren/Geräten ohne GPS-Fix oder mit deaktivierten Standortdiensten fehl,
        // obwohl die Berechtigung erteilt ist — `coords` bleibt dann `null` (bereits von Aufrufern als
        // „noch kein Standort" behandelt), statt einer ungefangenen Promise-Ablehnung.
        console.error('[useUserLocation] getCurrentPositionAsync() fehlgeschlagen:', error);
      });

    Location.watchPositionAsync(
      { accuracy: Location.Accuracy.Balanced, distanceInterval: WATCH_DISTANCE_INTERVAL_METERS },
      (position) => {
        if (isMounted) {
          setCoords(position.coords);
        }
      },
    )
      .then((newSubscription) => {
        if (isMounted) {
          subscription = newSubscription;
        } else {
          newSubscription.remove();
        }
      })
      .catch((error) => {
        console.error('[useUserLocation] watchPositionAsync() fehlgeschlagen:', error);
      });

    return () => {
      isMounted = false;
      subscription?.remove();
    };
  }, [status]);

  const requestPermission = useCallback(async (): Promise<LocationPermissionStatus> => {
    const response = await Location.requestForegroundPermissionsAsync();
    setStatus(response.status);

    return response.status;
  }, []);

  return { status, coords, isLoading, requestPermission };
}

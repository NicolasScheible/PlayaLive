import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useState } from 'react';

import { useCurrentActs } from './useCurrentActs';
import { useGreeting } from './useGreeting';
import { useHappyHours } from './useHappyHours';
import { useLiveOccupancy } from './useLiveOccupancy';
import { useNextAct } from './useNextAct';
import { useSpecials } from './useSpecials';
import { useTodayHighlights } from './useTodayHighlights';
import { useWeather } from './useWeather';

// Einziger Hook, den `HomeScreen.tsx` aufruft — bündelt alle Section-Hooks (siehe CLAUDE.md →
// Vorgehensweise: Business-Logik gehört in Hooks, nicht in Screens). Alle darunterliegenden
// TanStack-Query-Keys beginnen mit `'home'`, wodurch Pull-to-Refresh sämtliche Sections mit einem
// einzigen `invalidateQueries({ queryKey: ['home'] })`-Aufruf aktualisiert, statt jeden Hook einzeln
// `refetch()`en zu müssen.
export function useHomeDashboard() {
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const greeting = useGreeting();
  const weather = useWeather();
  const liveOccupancy = useLiveOccupancy();
  const todayHighlights = useTodayHighlights();
  const currentActs = useCurrentActs();
  const nextAct = useNextAct();
  const happyHours = useHappyHours();
  const specials = useSpecials();

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);

    try {
      await queryClient.invalidateQueries({ queryKey: ['home'] });
    } finally {
      setIsRefreshing(false);
    }
  }, [queryClient]);

  return {
    greeting,
    weather,
    liveOccupancy,
    todayHighlights,
    currentActs,
    nextAct,
    happyHours,
    specials,
    isRefreshing,
    onRefresh,
  };
}

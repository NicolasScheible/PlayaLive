import type { DrawerNavigationProp } from '@react-navigation/drawer';
import type { CompositeNavigationProp } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Mapbox from '@rnmapbox/maps';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { BottomSheet } from '../../../components/BottomSheet';
import { Button } from '../../../components/Button';
import { EmptyState } from '../../../components/EmptyState';
import { ErrorState } from '../../../components/ErrorState';
import { LoadingState } from '../../../components/LoadingState';
import type { MainDrawerParamList, MainStackParamList } from '../../../navigation/types';
import { theme } from '../../../theme/theme';
import { FilterBar } from '../components/FilterBar';
import { LocationBottomSheetContent } from '../components/LocationBottomSheetContent';
import { LocationMarkersLayer } from '../components/LocationMarkersLayer';
import { MapZoomControls } from '../components/MapZoomControls';
import { useMapScreen } from '../hooks/useMapScreen';

// Live-Map-Screen gemäß Auftrag Punkt 1 (Mapbox-Karte, Standort, Zoom Controls, Kompass, Loading-/
// Error-/Empty-State), orchestriert ausschließlich über `useMapScreen()` (CLAUDE.md → Vorgehensweise:
// keine Business-Logik/kein Datenzugriff im Screen). Playa de Palma als Kartenmittelpunkt, solange kein
// Nutzerstandort vorliegt — geografischer Startwert, keine Produktentscheidung.
const PLAYA_DE_PALMA_CENTER: [number, number] = [2.6339, 39.5158];
const DEFAULT_ZOOM_LEVEL = 14;
const MIN_ZOOM_LEVEL = 10;
const MAX_ZOOM_LEVEL = 18;

// „Map" ist seit der finalen Drawer-Navigation ein Screen des verschachtelten `MainDrawerNavigator`
// (siehe navigation/types.ts) — Navigation zu „LocationDetail" bleibt auf der übergeordneten
// Stack-Ebene, daher die zusammengesetzte Navigation-Prop (analog zu HomeScreen.tsx).
type MapScreenNavigationProp = CompositeNavigationProp<
  DrawerNavigationProp<MainDrawerParamList, 'Map'>,
  NativeStackNavigationProp<MainStackParamList>
>;

export function MapScreen() {
  const navigation = useNavigation<MapScreenNavigationProp>();
  const {
    userLocation,
    filteredLocations,
    markers,
    selectedLocationId,
    clearSelection,
    selectLocation,
    selectedLocation,
    isLoading,
    isError,
    error,
  } = useMapScreen();
  const [zoomLevel, setZoomLevel] = useState(DEFAULT_ZOOM_LEVEL);

  if (isLoading) {
    return <LoadingState label="Karte wird geladen" />;
  }

  if (isError) {
    return <ErrorState message={error?.message ?? 'Die Karte konnte nicht geladen werden.'} />;
  }

  const centerCoordinate: [number, number] = userLocation.coords
    ? [userLocation.coords.longitude, userLocation.coords.latitude]
    : PLAYA_DE_PALMA_CENTER;

  return (
    <View style={styles.container}>
      <Mapbox.MapView
        style={styles.map}
        styleURL={Mapbox.StyleURL.Dark}
        compassEnabled
        onPress={clearSelection}
      >
        <Mapbox.Camera
          centerCoordinate={centerCoordinate}
          zoomLevel={zoomLevel}
          animationDuration={300}
        />
        {userLocation.status === 'granted' ? <Mapbox.LocationPuck visible /> : null}
        <LocationMarkersLayer markers={markers} onPressLocation={selectLocation} />
      </Mapbox.MapView>

      {userLocation.status === 'undetermined' ? (
        <View style={styles.locationHint}>
          <Text style={styles.locationHintText}>
            Aktiviere deinen Standort, um deine Entfernung zu Locations zu sehen.
          </Text>
          <Button
            label="Standort aktivieren"
            variant="secondary"
            onPress={userLocation.requestPermission}
          />
        </View>
      ) : null}

      <View style={styles.filterBar}>
        <FilterBar />
      </View>

      <View style={styles.zoomControls}>
        <MapZoomControls
          onZoomIn={() => setZoomLevel((current) => Math.min(current + 1, MAX_ZOOM_LEVEL))}
          onZoomOut={() => setZoomLevel((current) => Math.max(current - 1, MIN_ZOOM_LEVEL))}
        />
      </View>

      {filteredLocations.length === 0 ? (
        <View style={styles.emptyOverlay}>
          <EmptyState message="Keine Locations für die aktuellen Filter gefunden." />
        </View>
      ) : null}

      <BottomSheet visible={selectedLocationId !== null} onClose={clearSelection}>
        {selectedLocation ? (
          <LocationBottomSheetContent
            location={selectedLocation.location}
            liveStatus={selectedLocation.location.liveStatus}
            activeHappyHours={selectedLocation.activeHappyHours}
            activeSpecials={selectedLocation.activeSpecials}
            currentEvents={selectedLocation.currentEvents}
            distanceMeters={selectedLocation.distanceMeters}
            onPressDetails={() =>
              navigation.navigate('LocationDetail', { locationId: selectedLocation.location.id })
            }
          />
        ) : null}
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  filterBar: {
    position: 'absolute',
    top: theme.spacing.md,
    left: 0,
    right: 0,
  },
  zoomControls: {
    position: 'absolute',
    right: theme.spacing.md,
    bottom: theme.spacing.xl,
  },
  locationHint: {
    position: 'absolute',
    bottom: theme.spacing.xl,
    left: theme.spacing.md,
    right: theme.spacing.md,
    backgroundColor: theme.colors.background.base,
    borderRadius: theme.radius.card,
    borderWidth: 1,
    borderColor: theme.colors.border.subtle,
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  locationHintText: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.body.fontSize,
  },
  emptyOverlay: {
    position: 'absolute',
    top: '45%',
    left: theme.spacing.md,
    right: theme.spacing.md,
    backgroundColor: theme.colors.background.base,
    borderRadius: theme.radius.card,
  },
});

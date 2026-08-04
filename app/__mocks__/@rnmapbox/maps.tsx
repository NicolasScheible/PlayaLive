// Manueller Jest-Mock für @rnmapbox/maps (natives Modul, kein Renderer im Test-Environment
// verfügbar). Automatisch von Jest verwendet, da `__mocks__/` neben `node_modules/` liegt (siehe
// https://jestjs.io/docs/manual-mocks#mocking-node-modules) — kein `jest.mock()`-Aufruf pro Testdatei
// nötig. Jede Komponente rendert sich als einfache `View` mit `testID` nach Komponentenname, damit
// Tests per `getByTestId`/`UNSAFE_getByType` darauf zugreifen können; interaktionsrelevante Props
// (`onPress` etc.) werden durchgereicht.
import type { ReactNode } from 'react';
import { View } from 'react-native';

function stubComponent(testID: string) {
  function StubComponent({ children, ...props }: { children?: ReactNode; [key: string]: unknown }) {
    return (
      <View testID={testID} {...props}>
        {children}
      </View>
    );
  }

  StubComponent.displayName = testID;

  return StubComponent;
}

const MapView = stubComponent('MapboxMapView');
const Camera = stubComponent('MapboxCamera');
const LocationPuck = stubComponent('MapboxLocationPuck');
const ShapeSource = stubComponent('MapboxShapeSource');
const CircleLayer = stubComponent('MapboxCircleLayer');
const SymbolLayer = stubComponent('MapboxSymbolLayer');
const Images = stubComponent('MapboxImages');

const setAccessToken = jest.fn();

enum StyleURL {
  Street = 'mapbox://styles/mapbox/streets-v11',
  Dark = 'mapbox://styles/mapbox/dark-v10',
  Light = 'mapbox://styles/mapbox/light-v10',
  Outdoors = 'mapbox://styles/mapbox/outdoors-v11',
  Satellite = 'mapbox://styles/mapbox/satellite-v9',
  SatelliteStreet = 'mapbox://styles/mapbox/satellite-streets-v11',
  TrafficDay = 'mapbox://styles/mapbox/navigation-preview-day-v4',
  TrafficNight = 'mapbox://styles/mapbox/navigation-preview-night-v4',
}

enum UserTrackingMode {
  Follow = 'normal',
  FollowWithHeading = 'compass',
  FollowWithCourse = 'course',
}

const Mapbox = {
  setAccessToken,
  StyleURL,
  UserTrackingMode,
  MapView,
  Camera,
  LocationPuck,
  ShapeSource,
  CircleLayer,
  SymbolLayer,
  Images,
};

export {
  Camera,
  CircleLayer,
  Images,
  LocationPuck,
  MapView,
  ShapeSource,
  StyleURL,
  SymbolLayer,
  UserTrackingMode,
  setAccessToken,
};
export default Mapbox;

import type { DrawerNavigationProp } from '@react-navigation/drawer';
import type { CompositeNavigationProp } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RefreshControl, ScrollView, StyleSheet } from 'react-native';

import { Header } from '../../../components/Header';
import type { MainDrawerParamList, MainStackParamList } from '../../../navigation/types';
import { theme } from '../../../theme/theme';
import { CurrentActsSection } from '../components/CurrentActsSection';
import { GreetingHeader } from '../components/GreetingHeader';
import { HappyHoursSection } from '../components/HappyHoursSection';
import { LiveOccupancySection } from '../components/LiveOccupancySection';
import { MapQuickAccessButton } from '../components/MapQuickAccessButton';
import { NextActSection } from '../components/NextActSection';
import { SpecialsSection } from '../components/SpecialsSection';
import { TodayHighlightsSection } from '../components/TodayHighlightsSection';
import { WeatherWidget } from '../components/WeatherWidget';
import { useHomeDashboard } from '../hooks/useHomeDashboard';

// `Home` ist seit der finalen Drawer-Navigation ein Screen des verschachtelten `MainDrawerNavigator`
// (siehe navigation/types.ts), nicht mehr direkt ein Stack-Screen — die Navigation-Prop ist daher eine
// Kombination aus Drawer- (für `.openDrawer()`/Drawer-Geschwister wie „Map") und Stack-Navigation
// (für Routen wie „LocationDetail", die weiterhin auf der übergeordneten Stack-Ebene liegen).
type HomeScreenNavigationProp = CompositeNavigationProp<
  DrawerNavigationProp<MainDrawerParamList, 'Home'>,
  NativeStackNavigationProp<MainStackParamList>
>;

// Home Dashboard gemäß docs/PRD.md Kapitel 10 — orchestriert ausschließlich über `useHomeDashboard()`
// (CLAUDE.md → Vorgehensweise: keine Business-Logik/Datenzugriff im Screen, ausschließlich Hooks).
export function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const dashboard = useHomeDashboard();

  return (
    <ScrollView
      testID="home-screen-scroll"
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={dashboard.isRefreshing}
          onRefresh={dashboard.onRefresh}
          tintColor={theme.colors.brand.primary}
        />
      }
    >
      <Header
        onPressMenu={() => navigation.openDrawer()}
        onPressSearch={() => navigation.navigate('Search')}
      />
      <GreetingHeader
        greeting={dashboard.greeting.greeting}
        displayName={dashboard.greeting.displayName}
      />
      <WeatherWidget
        weather={dashboard.weather.weather}
        isLoading={dashboard.weather.isLoading}
        isError={dashboard.weather.isError}
        error={dashboard.weather.error}
        onRetry={dashboard.weather.retry}
      />
      <MapQuickAccessButton onPress={() => navigation.navigate('Map')} />
      <LiveOccupancySection
        occupancies={dashboard.liveOccupancy.occupancies}
        isLoading={dashboard.liveOccupancy.isLoading}
        isError={dashboard.liveOccupancy.isError}
        error={dashboard.liveOccupancy.error}
        onRetry={dashboard.liveOccupancy.retry}
      />
      <TodayHighlightsSection
        events={dashboard.todayHighlights.events}
        isLoading={dashboard.todayHighlights.isLoading}
        isError={dashboard.todayHighlights.isError}
        error={dashboard.todayHighlights.error}
        onRetry={dashboard.todayHighlights.retry}
      />
      <CurrentActsSection
        acts={dashboard.currentActs.acts}
        isLoading={dashboard.currentActs.isLoading}
        isError={dashboard.currentActs.isError}
        error={dashboard.currentActs.error}
        onRetry={dashboard.currentActs.retry}
      />
      <NextActSection
        nextAct={dashboard.nextAct.nextAct}
        isLoading={dashboard.nextAct.isLoading}
        isError={dashboard.nextAct.isError}
        error={dashboard.nextAct.error}
        onRetry={dashboard.nextAct.retry}
      />
      <HappyHoursSection
        happyHours={dashboard.happyHours.happyHours}
        isLoading={dashboard.happyHours.isLoading}
        isError={dashboard.happyHours.isError}
        error={dashboard.happyHours.error}
        onRetry={dashboard.happyHours.retry}
      />
      <SpecialsSection
        specials={dashboard.specials.specials}
        isLoading={dashboard.specials.isLoading}
        isError={dashboard.specials.isError}
        error={dashboard.specials.error}
        onRetry={dashboard.specials.retry}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.base,
  },
  content: {
    paddingVertical: theme.spacing.md,
    gap: theme.spacing.lg,
  },
});

import { render, screen } from '@testing-library/react-native';

import { WeatherWidget } from './WeatherWidget';

const snapshot = {
  temperatureCelsius: 28,
  feelsLikeCelsius: 30,
  condition: 'klarer Himmel',
  conditionIcon: '01d',
  humidityPercent: 55,
  windSpeedKmh: 12,
  fetchedAt: '2026-08-04T12:00:00.000Z',
};

describe('WeatherWidget', () => {
  it('zeigt einen Skeleton-Loader während des Ladens', () => {
    render(<WeatherWidget weather={null} isLoading isError={false} error={null} />);

    expect(screen.queryByText('28°')).toBeNull();
  });

  it('zeigt eine Fehlermeldung bei isError', () => {
    render(
      <WeatherWidget
        weather={null}
        isLoading={false}
        isError
        error={{
          code: 'WEATHER_NOT_CONFIGURED',
          messageKey: 'x',
          message: 'Die Wetteranzeige ist aktuell nicht verfügbar.',
          technicalMessage: 'x',
        }}
      />,
    );

    expect(screen.getByText('Die Wetteranzeige ist aktuell nicht verfügbar.')).toBeTruthy();
  });

  it('zeigt Temperatur und Zustand bei Erfolg', () => {
    render(<WeatherWidget weather={snapshot} isLoading={false} isError={false} error={null} />);

    expect(screen.getByText('28°')).toBeTruthy();
    expect(screen.getByText('klarer Himmel')).toBeTruthy();
    expect(screen.getByText('Gefühlt 30°')).toBeTruthy();
  });
});

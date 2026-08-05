import { fireEvent, render, screen } from '@testing-library/react-native';

import { CommunityReportForm } from './CommunityReportForm';

describe('CommunityReportForm', () => {
  it('zeigt einen Standort-Hinweis, solange die Berechtigung unbestimmt ist', () => {
    const onRequestLocationPermission = jest.fn();

    render(
      <CommunityReportForm
        selectedLevel={null}
        onSelectLevel={jest.fn()}
        onSubmit={jest.fn()}
        isSubmitting={false}
        isWithinGeofence={false}
        locationPermissionStatus="undetermined"
        onRequestLocationPermission={onRequestLocationPermission}
      />,
    );

    fireEvent.press(screen.getByText('Standort aktivieren'));

    expect(onRequestLocationPermission).toHaveBeenCalledTimes(1);
    expect(screen.queryByText('Wenig los')).toBeNull();
  });

  it('zeigt einen Hinweis, wenn die Standortberechtigung verweigert wurde', () => {
    render(
      <CommunityReportForm
        selectedLevel={null}
        onSelectLevel={jest.fn()}
        onSubmit={jest.fn()}
        isSubmitting={false}
        isWithinGeofence={false}
        locationPermissionStatus="denied"
        onRequestLocationPermission={jest.fn()}
      />,
    );

    expect(screen.getByText(/Standortzugriff/)).toBeTruthy();
    expect(screen.queryByText('Wenig los')).toBeNull();
  });

  it('zeigt einen Hinweis außerhalb des Geofencing-Radius', () => {
    render(
      <CommunityReportForm
        selectedLevel={null}
        onSelectLevel={jest.fn()}
        onSubmit={jest.fn()}
        isSubmitting={false}
        isWithinGeofence={false}
        locationPermissionStatus="granted"
        onRequestLocationPermission={jest.fn()}
      />,
    );

    expect(screen.getByText(/zu weit von dieser Location entfernt/)).toBeTruthy();
    expect(screen.queryByText('Wenig los')).toBeNull();
  });

  it('zeigt das Auswahlformular innerhalb des Radius und ruft onSubmit auf', () => {
    const onSubmit = jest.fn();
    const onSelectLevel = jest.fn();

    render(
      <CommunityReportForm
        selectedLevel="high"
        onSelectLevel={onSelectLevel}
        onSubmit={onSubmit}
        isSubmitting={false}
        isWithinGeofence
        locationPermissionStatus="granted"
        onRequestLocationPermission={jest.fn()}
      />,
    );

    fireEvent.press(screen.getByText('Sehr voll'));
    expect(onSelectLevel).toHaveBeenCalledWith('high');

    fireEvent.press(screen.getByText('Melden'));
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('ruft onSubmit nicht auf, solange kein Level gewählt ist', () => {
    const onSubmit = jest.fn();

    render(
      <CommunityReportForm
        selectedLevel={null}
        onSelectLevel={jest.fn()}
        onSubmit={onSubmit}
        isSubmitting={false}
        isWithinGeofence
        locationPermissionStatus="granted"
        onRequestLocationPermission={jest.fn()}
      />,
    );

    fireEvent.press(screen.getByText('Melden'));

    expect(onSubmit).not.toHaveBeenCalled();
  });
});

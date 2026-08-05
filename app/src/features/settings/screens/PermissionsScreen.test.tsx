import { fireEvent, render, screen } from '@testing-library/react-native';
import { Linking } from 'react-native';

import { PermissionsScreen } from './PermissionsScreen';

const mockUseUserLocation = jest.fn();
const mockUsePhotoLibraryPermission = jest.fn();

jest.mock('../../../hooks/useUserLocation', () => ({
  useUserLocation: () => mockUseUserLocation(),
}));

jest.mock('../hooks/usePhotoLibraryPermission', () => ({
  usePhotoLibraryPermission: () => mockUsePhotoLibraryPermission(),
}));

const requestLocationPermission = jest.fn();
const requestPhotoLibraryPermission = jest.fn();

describe('PermissionsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseUserLocation.mockReturnValue({
      status: 'granted',
      requestPermission: requestLocationPermission,
    });
    mockUsePhotoLibraryPermission.mockReturnValue({
      status: 'granted',
      requestPermission: requestPhotoLibraryPermission,
    });
  });

  it('zeigt den erlaubten Status ohne Aktions-Button', () => {
    render(<PermissionsScreen />);

    expect(screen.getAllByText('Erlaubt')).toHaveLength(2);
    expect(screen.queryByText('Erlauben')).toBeNull();
    expect(screen.queryByText('Einstellungen öffnen')).toBeNull();
  });

  it('zeigt bei nicht festgelegtem Status einen „Erlauben"-Button und fragt die Berechtigung an', () => {
    mockUseUserLocation.mockReturnValue({
      status: 'undetermined',
      requestPermission: requestLocationPermission,
    });

    render(<PermissionsScreen />);

    fireEvent.press(screen.getByText('Erlauben'));

    expect(requestLocationPermission).toHaveBeenCalledTimes(1);
  });

  it('öffnet bei verweigertem Status die System-Einstellungen', () => {
    const openSettingsSpy = jest.spyOn(Linking, 'openSettings').mockResolvedValue();
    mockUsePhotoLibraryPermission.mockReturnValue({
      status: 'denied',
      requestPermission: requestPhotoLibraryPermission,
    });

    render(<PermissionsScreen />);

    fireEvent.press(screen.getByText('Einstellungen öffnen'));

    expect(openSettingsSpy).toHaveBeenCalledTimes(1);
  });
});

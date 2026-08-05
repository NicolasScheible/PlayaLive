import { render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';

import { SettingsSection } from './SettingsSection';

describe('SettingsSection', () => {
  it('zeigt den Titel und die Kinder', () => {
    render(
      <SettingsSection title="Konto">
        <Text>Profil bearbeiten</Text>
      </SettingsSection>,
    );

    expect(screen.getByText('KONTO')).toBeTruthy();
    expect(screen.getByText('Profil bearbeiten')).toBeTruthy();
  });
});

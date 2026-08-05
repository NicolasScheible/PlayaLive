import { fireEvent, render, screen } from '@testing-library/react-native';

import { ProfileHeader } from './ProfileHeader';

describe('ProfileHeader', () => {
  it('zeigt Benutzername, E-Mail und Mitglied-seit-Datum', () => {
    render(
      <ProfileHeader
        avatarUrl={null}
        username="DJ Test"
        email="dj@example.com"
        memberSince="2026-01-15T00:00:00.000Z"
        isUploadingAvatar={false}
        onPressChangeAvatar={jest.fn()}
      />,
    );

    expect(screen.getByText('DJ Test')).toBeTruthy();
    expect(screen.getByText('dj@example.com')).toBeTruthy();
    expect(screen.getByText('Mitglied seit 15.01.2026')).toBeTruthy();
  });

  it('zeigt einen Platzhalternamen ohne Benutzername', () => {
    render(
      <ProfileHeader
        avatarUrl={null}
        username={null}
        email={null}
        memberSince="2026-01-15T00:00:00.000Z"
        isUploadingAvatar={false}
        onPressChangeAvatar={jest.fn()}
      />,
    );

    expect(screen.getByText('Ohne Namen')).toBeTruthy();
  });

  it('ruft onPressChangeAvatar beim Tippen auf den Avatar-Bearbeiten-Button auf', () => {
    const onPressChangeAvatar = jest.fn();

    render(
      <ProfileHeader
        avatarUrl={null}
        username="DJ Test"
        email="dj@example.com"
        memberSince="2026-01-15T00:00:00.000Z"
        isUploadingAvatar={false}
        onPressChangeAvatar={onPressChangeAvatar}
      />,
    );

    fireEvent.press(screen.getByLabelText('Profilbild ändern'));

    expect(onPressChangeAvatar).toHaveBeenCalledTimes(1);
  });
});

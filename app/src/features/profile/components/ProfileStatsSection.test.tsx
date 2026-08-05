import { render, screen } from '@testing-library/react-native';

import { ProfileStatsSection } from './ProfileStatsSection';

describe('ProfileStatsSection', () => {
  it('zeigt Trust Score, Reports, Reviews und Favoriten', () => {
    render(
      <ProfileStatsSection trustScore={42} reportsCount={5} reviewsCount={3} favoritesCount={7} />,
    );

    expect(screen.getByText('42')).toBeTruthy();
    expect(screen.getByText('Trust Score')).toBeTruthy();
    expect(screen.getByText('5')).toBeTruthy();
    expect(screen.getByText('Reports')).toBeTruthy();
    expect(screen.getByText('3')).toBeTruthy();
    expect(screen.getByText('Reviews')).toBeTruthy();
    expect(screen.getByText('7')).toBeTruthy();
    expect(screen.getByText('Favoriten')).toBeTruthy();
  });
});

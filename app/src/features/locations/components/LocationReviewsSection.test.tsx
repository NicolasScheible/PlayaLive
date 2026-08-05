import { render, screen } from '@testing-library/react-native';

import type { Review } from '../../../types/entities';

import { LocationReviewsSection } from './LocationReviewsSection';

const review: Review = {
  id: 'rev-1',
  user_id: 'user-1',
  target_type: 'location',
  target_id: 'loc-1',
  rating: 5,
  comment_text: 'Top Location!',
  created_at: new Date().toISOString(),
  updated_at: '',
  deleted_at: null,
};

describe('LocationReviewsSection', () => {
  it('zeigt Durchschnitt, Anzahl und die Bewertungsliste', () => {
    render(
      <LocationReviewsSection
        averageRating={4.3}
        reviewCount={3}
        reviews={[review]}
        isLoading={false}
        isError={false}
        error={null}
      />,
    );

    expect(screen.getByText('4.3 (3 Bewertungen)')).toBeTruthy();
    expect(screen.getByText('Top Location!')).toBeTruthy();
  });

  it('zeigt den Singular bei genau einer Bewertung', () => {
    render(
      <LocationReviewsSection
        averageRating={5}
        reviewCount={1}
        reviews={[review]}
        isLoading={false}
        isError={false}
        error={null}
      />,
    );

    expect(screen.getByText('5.0 (1 Bewertung)')).toBeTruthy();
  });

  it('zeigt einen Empty State ohne Bewertungen', () => {
    render(
      <LocationReviewsSection
        averageRating={null}
        reviewCount={0}
        reviews={[]}
        isLoading={false}
        isError={false}
        error={null}
      />,
    );

    expect(screen.getByText('Noch keine Bewertungen.')).toBeTruthy();
  });

  it('zeigt einen Fehlerzustand', () => {
    render(
      <LocationReviewsSection
        averageRating={null}
        reviewCount={0}
        reviews={[]}
        isLoading={false}
        isError
        error={{
          code: 'ERR',
          messageKey: 'x',
          message: 'Fehler beim Laden',
          technicalMessage: 'x',
        }}
      />,
    );

    expect(screen.getByText('Fehler beim Laden')).toBeTruthy();
  });
});

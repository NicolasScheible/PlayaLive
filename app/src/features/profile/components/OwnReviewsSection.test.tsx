import { fireEvent, render, screen } from '@testing-library/react-native';

import type { OwnReviewWithTargetName } from '../hooks/useOwnReviews';

import { OwnReviewsSection } from './OwnReviewsSection';

const review: OwnReviewWithTargetName = {
  id: 'review-1',
  user_id: 'user-1',
  target_type: 'location',
  target_id: 'loc-1',
  rating: 5,
  comment_text: 'Toller Club.',
  created_at: new Date().toISOString(),
  updated_at: '',
  deleted_at: null,
  targetName: 'Test Club',
};

describe('OwnReviewsSection', () => {
  it('zeigt eigene Bewertungen und navigiert beim Klick', () => {
    const onPressReview = jest.fn();

    render(
      <OwnReviewsSection
        reviews={[review]}
        isLoading={false}
        isError={false}
        error={null}
        onPressReview={onPressReview}
      />,
    );

    expect(screen.getByText('Test Club')).toBeTruthy();
    expect(screen.getByText('Toller Club.')).toBeTruthy();

    fireEvent.press(screen.getByText('Test Club'));

    expect(onPressReview).toHaveBeenCalledWith(review);
  });

  it('zeigt einen Empty State ohne eigene Bewertungen', () => {
    render(
      <OwnReviewsSection
        reviews={[]}
        isLoading={false}
        isError={false}
        error={null}
        onPressReview={jest.fn()}
      />,
    );

    expect(screen.getByText('Du hast noch keine Bewertungen abgegeben.')).toBeTruthy();
  });

  it('zeigt einen Fehlerzustand', () => {
    render(
      <OwnReviewsSection
        reviews={[]}
        isLoading={false}
        isError
        error={{
          code: 'ERR',
          messageKey: 'x',
          message: 'Fehler beim Laden',
          technicalMessage: 'x',
        }}
        onPressReview={jest.fn()}
      />,
    );

    expect(screen.getByText('Fehler beim Laden')).toBeTruthy();
  });
});

import { fireEvent, render, screen } from '@testing-library/react-native';

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

const otherReview: Review = {
  ...review,
  id: 'rev-2',
  user_id: 'user-2',
  comment_text: 'Auch gut.',
};

const noop = () => {
  // no-op
};

describe('LocationReviewsSection', () => {
  it('zeigt Durchschnitt, Anzahl und die Bewertungsliste', () => {
    render(
      <LocationReviewsSection
        averageRating={4.3}
        reviewCount={3}
        reviews={[review]}
        ownReview={null}
        isLoading={false}
        isError={false}
        error={null}
        onPressCreate={noop}
        onPressEdit={noop}
        onPressDelete={noop}
        onPressFlag={noop}
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
        ownReview={null}
        isLoading={false}
        isError={false}
        error={null}
        onPressCreate={noop}
        onPressEdit={noop}
        onPressDelete={noop}
        onPressFlag={noop}
      />,
    );

    expect(screen.getByText('5.0 (1 Bewertung)')).toBeTruthy();
  });

  it('zeigt einen Empty State mit Button zum Bewerten ohne Bewertungen', () => {
    const onPressCreate = jest.fn();

    render(
      <LocationReviewsSection
        averageRating={null}
        reviewCount={0}
        reviews={[]}
        ownReview={null}
        isLoading={false}
        isError={false}
        error={null}
        onPressCreate={onPressCreate}
        onPressEdit={noop}
        onPressDelete={noop}
        onPressFlag={noop}
      />,
    );

    expect(screen.getByText('Noch keine Bewertungen.')).toBeTruthy();

    fireEvent.press(screen.getByText('Bewertung abgeben'));

    expect(onPressCreate).toHaveBeenCalledTimes(1);
  });

  it('zeigt einen Fehlerzustand', () => {
    render(
      <LocationReviewsSection
        averageRating={null}
        reviewCount={0}
        reviews={[]}
        ownReview={null}
        isLoading={false}
        isError
        error={{
          code: 'ERR',
          messageKey: 'x',
          message: 'Fehler beim Laden',
          technicalMessage: 'x',
        }}
        onPressCreate={noop}
        onPressEdit={noop}
        onPressDelete={noop}
        onPressFlag={noop}
      />,
    );

    expect(screen.getByText('Fehler beim Laden')).toBeTruthy();
  });

  it('zeigt Bearbeiten/Löschen für die eigene Bewertung und ruft die Handler auf', () => {
    const onPressEdit = jest.fn();
    const onPressDelete = jest.fn();

    render(
      <LocationReviewsSection
        averageRating={5}
        reviewCount={1}
        reviews={[review]}
        ownReview={review}
        isLoading={false}
        isError={false}
        error={null}
        onPressCreate={noop}
        onPressEdit={onPressEdit}
        onPressDelete={onPressDelete}
        onPressFlag={noop}
      />,
    );

    fireEvent.press(screen.getByText('Bearbeiten'));
    fireEvent.press(screen.getByText('Löschen'));

    expect(onPressEdit).toHaveBeenCalledWith(review);
    expect(onPressDelete).toHaveBeenCalledWith(review);
  });

  it('zeigt „Melden" für fremde Bewertungen und ruft den Handler auf', () => {
    const onPressFlag = jest.fn();

    render(
      <LocationReviewsSection
        averageRating={5}
        reviewCount={1}
        reviews={[otherReview]}
        ownReview={null}
        isLoading={false}
        isError={false}
        error={null}
        onPressCreate={noop}
        onPressEdit={noop}
        onPressDelete={noop}
        onPressFlag={onPressFlag}
      />,
    );

    fireEvent.press(screen.getByText('Melden'));

    expect(onPressFlag).toHaveBeenCalledWith(otherReview);
  });

  it('zeigt keinen „Bewertung abgeben"-Button, wenn bereits eine eigene Bewertung existiert', () => {
    render(
      <LocationReviewsSection
        averageRating={5}
        reviewCount={1}
        reviews={[review]}
        ownReview={review}
        isLoading={false}
        isError={false}
        error={null}
        onPressCreate={noop}
        onPressEdit={noop}
        onPressDelete={noop}
        onPressFlag={noop}
      />,
    );

    expect(screen.queryByText('Bewertung abgeben')).toBeNull();
  });
});

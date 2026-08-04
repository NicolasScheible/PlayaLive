import { isValidFavoriteTargetType } from './favoriteValidation';

describe('isValidFavoriteTargetType', () => {
  it('akzeptiert location/artist/event', () => {
    expect(isValidFavoriteTargetType('location')).toBe(true);
    expect(isValidFavoriteTargetType('artist')).toBe(true);
    expect(isValidFavoriteTargetType('event')).toBe(true);
  });

  it('lehnt unbekannte Werte ab', () => {
    expect(isValidFavoriteTargetType('review')).toBe(false);
  });
});

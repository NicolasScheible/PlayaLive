import { useFilterStore } from './filterStore';

const initialState = {
  category: null,
  occupancyLevel: null,
  openNow: false,
  favoritesOnly: false,
};

describe('useFilterStore', () => {
  beforeEach(() => {
    useFilterStore.setState(initialState);
  });

  it('startet ohne aktive Filter', () => {
    expect(useFilterStore.getState()).toMatchObject(initialState);
  });

  it('setCategory setzt die Kategorie', () => {
    useFilterStore.getState().setCategory('club');

    expect(useFilterStore.getState().category).toBe('club');
  });

  it('setOccupancyLevel setzt die Auslastung', () => {
    useFilterStore.getState().setOccupancyLevel('high');

    expect(useFilterStore.getState().occupancyLevel).toBe('high');
  });

  it('setOpenNow/setFavoritesOnly setzen die booleschen Filter', () => {
    useFilterStore.getState().setOpenNow(true);
    useFilterStore.getState().setFavoritesOnly(true);

    expect(useFilterStore.getState().openNow).toBe(true);
    expect(useFilterStore.getState().favoritesOnly).toBe(true);
  });

  it('reset setzt alle Filter auf den Ausgangszustand zurück', () => {
    useFilterStore.getState().setCategory('bar');
    useFilterStore.getState().setOccupancyLevel('low');
    useFilterStore.getState().setOpenNow(true);
    useFilterStore.getState().setFavoritesOnly(true);

    useFilterStore.getState().reset();

    expect(useFilterStore.getState()).toMatchObject(initialState);
  });
});

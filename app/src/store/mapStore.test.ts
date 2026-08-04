import { useMapStore } from './mapStore';

describe('useMapStore', () => {
  beforeEach(() => {
    useMapStore.setState({ selectedLocationId: null });
  });

  it('startet ohne ausgewählte Location', () => {
    expect(useMapStore.getState().selectedLocationId).toBeNull();
  });

  it('selectLocation setzt die ausgewählte Location', () => {
    useMapStore.getState().selectLocation('loc-1');

    expect(useMapStore.getState().selectedLocationId).toBe('loc-1');
  });

  it('clearSelection setzt die Auswahl zurück', () => {
    useMapStore.getState().selectLocation('loc-1');
    useMapStore.getState().clearSelection();

    expect(useMapStore.getState().selectedLocationId).toBeNull();
  });
});

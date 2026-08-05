import { act, renderHook, waitFor } from '@testing-library/react-native';

import { createQueryWrapper } from './testUtils';
import { useFavoriteList } from './useFavoriteList';

const mockGetFavorites = jest.fn();
const mockToggleFavorite = jest.fn();

jest.mock('../../../services/FavoriteService', () => ({
  FavoriteService: {
    getFavorites: (...args: unknown[]) => mockGetFavorites(...args),
    toggleFavorite: (...args: unknown[]) => mockToggleFavorite(...args),
  },
}));

type Entity = { id: string; name: string };

const entities: Entity[] = [
  { id: 'e-1', name: 'Erste' },
  { id: 'e-2', name: 'Zweite' },
];

function renderFavoriteList(enabled = true) {
  return renderHook(
    () =>
      useFavoriteList<Entity>({
        targetType: 'location',
        entityQueryKey: ['test', 'entities'],
        fetchEntities: () => Promise.resolve(entities),
        getId: (entity) => entity.id,
        enabled,
      }),
    { wrapper: createQueryWrapper() },
  );
}

describe('useFavoriteList', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('verknüpft Favoriten mit den geladenen Entitäten in Favoriten-Reihenfolge', async () => {
    mockGetFavorites.mockResolvedValue([
      { id: 'fav-2', user_id: 'u1', target_type: 'location', target_id: 'e-2', created_at: '' },
      { id: 'fav-1', user_id: 'u1', target_type: 'location', target_id: 'e-1', created_at: '' },
    ]);

    const { result } = renderFavoriteList();

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.items).toEqual([entities[1], entities[0]]);
    expect(mockGetFavorites).toHaveBeenCalledWith('location');
  });

  it('lässt Favoriten ohne auflösbare Entität aus', async () => {
    mockGetFavorites.mockResolvedValue([
      { id: 'fav-1', user_id: 'u1', target_type: 'location', target_id: 'missing', created_at: '' },
    ]);

    const { result } = renderFavoriteList();

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.items).toEqual([]);
  });

  it('lädt nicht, solange enabled=false ist', () => {
    renderFavoriteList(false);

    expect(mockGetFavorites).not.toHaveBeenCalled();
  });

  it('entfernt einen Favoriten optimistisch, bevor die Mutation abgeschlossen ist', async () => {
    mockGetFavorites.mockResolvedValue([
      { id: 'fav-1', user_id: 'u1', target_type: 'location', target_id: 'e-1', created_at: '' },
      { id: 'fav-2', user_id: 'u1', target_type: 'location', target_id: 'e-2', created_at: '' },
    ]);
    let resolveToggle: (value: boolean) => void = () => {};
    mockToggleFavorite.mockReturnValue(
      new Promise((resolve) => {
        resolveToggle = resolve;
      }),
    );

    const { result } = renderFavoriteList();

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.items).toHaveLength(2);

    act(() => {
      result.current.remove('e-1');
    });

    await waitFor(() => expect(result.current.items).toEqual([entities[1]]));

    await act(async () => {
      resolveToggle(false);
    });
  });

  it('macht die optimistische Entfernung bei einem Fehler rückgängig', async () => {
    mockGetFavorites.mockResolvedValue([
      { id: 'fav-1', user_id: 'u1', target_type: 'location', target_id: 'e-1', created_at: '' },
    ]);
    mockToggleFavorite.mockRejectedValue({
      code: 'ERR',
      messageKey: 'x',
      message: 'Fehler beim Entfernen',
      technicalMessage: 'x',
    });

    const { result } = renderFavoriteList();

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      result.current.remove('e-1');
      await waitFor(() => expect(mockToggleFavorite).toHaveBeenCalledWith('location', 'e-1'));
    });

    await waitFor(() => expect(result.current.items).toEqual([entities[0]]));
  });
});

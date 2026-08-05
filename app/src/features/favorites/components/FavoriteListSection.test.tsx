import { fireEvent, render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';

import { FavoriteListSection } from './FavoriteListSection';

type Entity = { id: string; name: string };

const entity: Entity = { id: 'e-1', name: 'Erste' };

describe('FavoriteListSection', () => {
  it('zeigt einen Ladezustand', () => {
    render(
      <FavoriteListSection<Entity>
        items={[]}
        getKey={(item) => item.id}
        isLoading
        isError={false}
        error={null}
        emptyMessage="Keine Einträge"
        loadingAccessibilityLabel="Wird geladen"
        renderItem={(item) => <Text>{item.name}</Text>}
      />,
    );

    expect(screen.getByLabelText('Wird geladen')).toBeTruthy();
  });

  it('zeigt einen Fehlerzustand', () => {
    render(
      <FavoriteListSection<Entity>
        items={[]}
        getKey={(item) => item.id}
        isLoading={false}
        isError
        error={{
          code: 'ERR',
          messageKey: 'x',
          message: 'Fehler beim Laden',
          technicalMessage: 'x',
        }}
        emptyMessage="Keine Einträge"
        loadingAccessibilityLabel="Wird geladen"
        renderItem={(item) => <Text>{item.name}</Text>}
      />,
    );

    expect(screen.getByText('Fehler beim Laden')).toBeTruthy();
  });

  it('zeigt einen Empty State ohne Einträge', () => {
    render(
      <FavoriteListSection<Entity>
        items={[]}
        getKey={(item) => item.id}
        isLoading={false}
        isError={false}
        error={null}
        emptyMessage="Keine Einträge"
        loadingAccessibilityLabel="Wird geladen"
        renderItem={(item) => <Text>{item.name}</Text>}
      />,
    );

    expect(screen.getByText('Keine Einträge')).toBeTruthy();
  });

  it('rendert jeden Eintrag über renderItem', () => {
    const onPress = jest.fn();

    render(
      <FavoriteListSection<Entity>
        items={[entity]}
        getKey={(item) => item.id}
        isLoading={false}
        isError={false}
        error={null}
        emptyMessage="Keine Einträge"
        loadingAccessibilityLabel="Wird geladen"
        renderItem={(item) => <Text onPress={() => onPress(item.id)}>{item.name}</Text>}
      />,
    );

    fireEvent.press(screen.getByText('Erste'));

    expect(onPress).toHaveBeenCalledWith('e-1');
  });
});

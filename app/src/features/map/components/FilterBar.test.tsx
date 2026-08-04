import { fireEvent, render, screen } from '@testing-library/react-native';

import { useFilterStore } from '../../../store/filterStore';

import { FilterBar } from './FilterBar';

describe('FilterBar', () => {
  beforeEach(() => {
    useFilterStore.setState({
      category: null,
      occupancyLevel: null,
      openNow: false,
      favoritesOnly: false,
    });
  });

  it('zeigt Chips für Kategorie, Auslastung, Geöffnet und Favoriten', () => {
    render(<FilterBar />);

    expect(screen.getByText('Clubs')).toBeTruthy();
    expect(screen.getByText('Bars')).toBeTruthy();
    expect(screen.getByText('Wenig los')).toBeTruthy();
    expect(screen.getByText('Gut besucht')).toBeTruthy();
    expect(screen.getByText('Sehr voll')).toBeTruthy();
    expect(screen.getByText('Geöffnet')).toBeTruthy();
    expect(screen.getByText('Favoriten')).toBeTruthy();
  });

  it('setzt die Kategorie im filterStore beim Tippen auf einen Chip', () => {
    render(<FilterBar />);

    fireEvent.press(screen.getByText('Clubs'));

    expect(useFilterStore.getState().category).toBe('club');
  });

  it('setzt die Kategorie über den Chip „Alle" zurück', () => {
    useFilterStore.getState().setCategory('bar');
    render(<FilterBar />);

    fireEvent.press(screen.getByText('Alle'));

    expect(useFilterStore.getState().category).toBeNull();
  });

  it('togglet „Geöffnet"/„Favoriten"', () => {
    render(<FilterBar />);

    fireEvent.press(screen.getByText('Geöffnet'));
    fireEvent.press(screen.getByText('Favoriten'));

    expect(useFilterStore.getState().openNow).toBe(true);
    expect(useFilterStore.getState().favoritesOnly).toBe(true);
  });
});

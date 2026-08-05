import { fireEvent, render, screen } from '@testing-library/react-native';

import { ReviewFormScreen } from './ReviewFormScreen';

const mockGoBack = jest.fn();
const mockCreateReview = jest.fn();
const mockUpdateReview = jest.fn();
const mockUseCreateReview = jest.fn();
const mockUseUpdateReview = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ goBack: mockGoBack }),
}));

jest.mock('../hooks/useCreateReview', () => ({
  useCreateReview: () => mockUseCreateReview(),
}));

jest.mock('../hooks/useUpdateReview', () => ({
  useUpdateReview: () => mockUseUpdateReview(),
}));

function renderScreen(
  params: {
    targetType: 'location' | 'artist';
    targetId: string;
    review?: { id: string; rating: number; commentText: string | null };
  } = { targetType: 'location', targetId: 'loc-1' },
) {
  const props = { route: { params } } as unknown as Parameters<typeof ReviewFormScreen>[0];

  return render(<ReviewFormScreen {...props} />);
}

describe('ReviewFormScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseCreateReview.mockReturnValue({
      createReview: mockCreateReview,
      isSubmitting: false,
      isSuccess: false,
      error: null,
    });
    mockUseUpdateReview.mockReturnValue({
      updateReview: mockUpdateReview,
      isSubmitting: false,
      isSuccess: false,
      error: null,
    });
  });

  it('zeigt einen Fehler, wenn ohne Sterne abgesendet wird', () => {
    renderScreen();

    fireEvent.press(screen.getByText('Bewertung abgeben'));

    expect(screen.getByText('Bitte wähle eine Sternebewertung aus.')).toBeTruthy();
    expect(mockCreateReview).not.toHaveBeenCalled();
  });

  it('erstellt eine neue Bewertung mit Sternen und Kommentar', () => {
    renderScreen();

    fireEvent.press(screen.getByLabelText('5 Sterne'));
    fireEvent.changeText(screen.getByPlaceholderText('Wie war dein Erlebnis?'), 'Top Location!');
    fireEvent.press(screen.getByText('Bewertung abgeben'));

    expect(mockCreateReview).toHaveBeenCalledWith({
      targetType: 'location',
      targetId: 'loc-1',
      rating: 5,
      commentText: 'Top Location!',
    });
  });

  it('befüllt das Formular im Bearbeitungsmodus vor und ruft updateReview auf', () => {
    renderScreen({
      targetType: 'location',
      targetId: 'loc-1',
      review: { id: 'rev-1', rating: 3, commentText: 'Ganz ok.' },
    });

    expect(screen.getByDisplayValue('Ganz ok.')).toBeTruthy();

    fireEvent.press(screen.getByText('Speichern'));

    expect(mockUpdateReview).toHaveBeenCalledWith('rev-1', 'location', 'loc-1', {
      rating: 3,
      commentText: 'Ganz ok.',
    });
  });

  it('navigiert nach erfolgreichem Absenden zurück', () => {
    mockUseCreateReview.mockReturnValue({
      createReview: mockCreateReview,
      isSubmitting: false,
      isSuccess: true,
      error: null,
    });

    renderScreen();

    expect(mockGoBack).toHaveBeenCalledTimes(1);
  });

  it('zeigt einen Fehler aus dem Hook', () => {
    mockUseCreateReview.mockReturnValue({
      createReview: mockCreateReview,
      isSubmitting: false,
      isSuccess: false,
      error: {
        code: 'ERR',
        messageKey: 'x',
        message: 'Etwas ist schiefgelaufen.',
        technicalMessage: 'x',
      },
    });

    renderScreen();

    expect(screen.getByText('Etwas ist schiefgelaufen.')).toBeTruthy();
  });
});

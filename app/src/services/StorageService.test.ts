import { StorageService } from './StorageService';

const mockUpload = jest.fn();
const mockCreateSignedUrl = jest.fn();
const mockFrom = jest.fn((_bucket: string) => ({
  upload: mockUpload,
  createSignedUrl: mockCreateSignedUrl,
}));
const mockGetSession = jest.fn();

jest.mock('../lib/supabase', () => ({
  supabase: { storage: { from: (bucket: string) => mockFrom(bucket) } },
}));
jest.mock('./AuthService', () => ({
  AuthService: { getSession: (...args: unknown[]) => mockGetSession(...args) },
}));

const fakeBlob = { size: 123 };
const session = { user: { id: 'user-1' } };

describe('StorageService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetSession.mockResolvedValue({ session });
    globalThis.fetch = jest
      .fn()
      .mockResolvedValue({ blob: () => Promise.resolve(fakeBlob) }) as never;
  });

  it('lädt das Bild in den profiles-Bucket unter <userId>/... hoch und gibt eine signierte URL zurück', async () => {
    mockUpload.mockResolvedValue({ error: null });
    mockCreateSignedUrl.mockResolvedValue({
      data: { signedUrl: 'https://example.test/signed/avatar.jpg' },
      error: null,
    });

    const result = await StorageService.uploadAvatar({
      uri: 'file:///tmp/avatar.jpg',
      mimeType: 'image/jpeg',
    });

    expect(mockFrom).toHaveBeenCalledWith('profiles');
    expect(mockUpload).toHaveBeenCalledWith(
      expect.stringMatching(/^user-1\/avatar-\d+\.jpeg$/),
      fakeBlob,
      { contentType: 'image/jpeg', upsert: true },
    );
    expect(result).toBe('https://example.test/signed/avatar.jpg');
  });

  it('wirft AUTH_SESSION_MISSING ohne aktive Session', async () => {
    mockGetSession.mockResolvedValue({ session: null });

    await expect(
      StorageService.uploadAvatar({ uri: 'file:///tmp/avatar.jpg', mimeType: 'image/jpeg' }),
    ).rejects.toMatchObject({ code: 'AUTH_SESSION_MISSING' });
    expect(mockUpload).not.toHaveBeenCalled();
  });

  it('wirft einen gemappten Fehler statt eines rohen TypeError, wenn die lokale Datei nicht gelesen werden kann', async () => {
    globalThis.fetch = jest
      .fn()
      .mockRejectedValue(new TypeError('Network request failed')) as never;

    await expect(
      StorageService.uploadAvatar({ uri: 'file:///tmp/avatar.jpg', mimeType: 'image/jpeg' }),
    ).rejects.toMatchObject({ code: 'NETWORK_OFFLINE' });
    expect(mockUpload).not.toHaveBeenCalled();
  });

  it('wirft einen gemappten Fehler, wenn der Upload fehlschlägt', async () => {
    mockUpload.mockResolvedValue({ error: { message: 'upload failed' } });

    await expect(
      StorageService.uploadAvatar({ uri: 'file:///tmp/avatar.jpg', mimeType: 'image/jpeg' }),
    ).rejects.toMatchObject({ code: 'UNKNOWN_ERROR' });
    expect(mockCreateSignedUrl).not.toHaveBeenCalled();
  });

  it('wirft einen gemappten Fehler, wenn das Erzeugen der signierten URL fehlschlägt', async () => {
    mockUpload.mockResolvedValue({ error: null });
    mockCreateSignedUrl.mockResolvedValue({ data: null, error: { message: 'signing failed' } });

    await expect(
      StorageService.uploadAvatar({ uri: 'file:///tmp/avatar.jpg', mimeType: 'image/jpeg' }),
    ).rejects.toMatchObject({ code: 'UNKNOWN_ERROR' });
  });
});

import { AuthApiError, AuthRetryableFetchError } from '@supabase/supabase-js';

import { AuthService } from './AuthService';

function createQueryBuilderMock(result: { data: unknown; error: unknown }) {
  const builder: Record<string, unknown> = {};
  ['select', 'update', 'eq'].forEach((method) => {
    builder[method] = jest.fn(() => builder);
  });
  builder.single = jest.fn().mockResolvedValue(result);
  builder.maybeSingle = jest.fn().mockResolvedValue(result);

  return builder;
}

jest.mock('../lib/supabase', () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn(),
      signUp: jest.fn(),
      resetPasswordForEmail: jest.fn(),
      updateUser: jest.fn(),
      getSession: jest.fn(),
    },
    from: jest.fn(),
  },
}));

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { supabase } = require('../lib/supabase');

describe('AuthService Fehler-Mapping', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('übersetzt invalid_credentials in eine einheitliche Meldung (kein Enumeration-Hinweis)', async () => {
    supabase.auth.signInWithPassword.mockResolvedValue({
      data: {},
      error: new AuthApiError('Invalid login credentials', 400, 'invalid_credentials'),
    });

    await expect(AuthService.signInWithPassword('a@b.de', 'falsch')).rejects.toMatchObject({
      code: 'AUTH_INVALID_CREDENTIALS',
      message: 'E-Mail oder Passwort ist falsch.',
    });
  });

  it('übersetzt user_already_exists beim Registrieren', async () => {
    supabase.auth.signUp.mockResolvedValue({
      data: {},
      error: new AuthApiError('User already registered', 422, 'user_already_exists'),
    });

    await expect(
      AuthService.signUpWithPassword({
        email: 'a@b.de',
        password: 'geheim123',
        username: 'Nutzer',
      }),
    ).rejects.toMatchObject({
      code: 'AUTH_EMAIL_ALREADY_REGISTERED',
      message: 'Für diese E-Mail-Adresse besteht bereits ein Konto.',
    });
  });

  it('übersetzt einen Netzwerkfehler', async () => {
    supabase.auth.resetPasswordForEmail.mockResolvedValue({
      data: {},
      error: new AuthRetryableFetchError('Network request failed', 0),
    });

    await expect(AuthService.resetPasswordForEmail('a@b.de')).rejects.toMatchObject({
      code: 'NETWORK_OFFLINE',
    });
  });

  it('löst auf, wenn Supabase keinen Fehler zurückgibt', async () => {
    supabase.auth.signInWithPassword.mockResolvedValue({ data: {}, error: null });

    await expect(AuthService.signInWithPassword('a@b.de', 'geheim123')).resolves.toBeUndefined();
  });
});

describe('AuthService.changePassword', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('ruft supabase.auth.updateUser mit dem neuen Passwort auf', async () => {
    supabase.auth.updateUser.mockResolvedValue({ data: {}, error: null });

    await expect(AuthService.changePassword('neuesPasswort123')).resolves.toBeUndefined();

    expect(supabase.auth.updateUser).toHaveBeenCalledWith({ password: 'neuesPasswort123' });
  });

  it('übersetzt einen Fehler von updateUser', async () => {
    supabase.auth.updateUser.mockResolvedValue({
      data: {},
      error: new AuthApiError('Password should be at least 6 characters', 422, 'weak_password'),
    });

    await expect(AuthService.changePassword('123')).rejects.toMatchObject({
      code: 'AUTH_WEAK_PASSWORD',
    });
  });
});

describe('AuthService Profil-Zugriff', () => {
  const session = { user: { id: 'user-1' } };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('getProfile wirft AUTH_SESSION_MISSING ohne aktive Session', async () => {
    supabase.auth.getSession.mockResolvedValue({ data: { session: null } });

    await expect(AuthService.getProfile()).rejects.toMatchObject({ code: 'AUTH_SESSION_MISSING' });
    expect(supabase.from).not.toHaveBeenCalled();
  });

  it('getProfile lädt das Profil des angemeldeten Nutzers', async () => {
    supabase.auth.getSession.mockResolvedValue({ data: { session } });
    const profile = { id: 'user-1', display_name: 'Alice' };
    const builder = createQueryBuilderMock({ data: profile, error: null });
    supabase.from.mockReturnValue(builder);

    const result = await AuthService.getProfile();

    expect(supabase.from).toHaveBeenCalledWith('profiles');
    expect(builder.eq).toHaveBeenCalledWith('id', 'user-1');
    expect(result).toEqual(profile);
  });

  it('updateProfile aktualisiert ausschließlich die übergebenen Felder', async () => {
    supabase.auth.getSession.mockResolvedValue({ data: { session } });
    const updated = { id: 'user-1', display_name: 'Neuer Name' };
    const builder = createQueryBuilderMock({ data: updated, error: null });
    supabase.from.mockReturnValue(builder);

    const result = await AuthService.updateProfile({ displayName: 'Neuer Name' });

    expect(builder.update).toHaveBeenCalledWith({ display_name: 'Neuer Name' });
    expect(result).toEqual(updated);
  });
});

import { AuthApiError, AuthRetryableFetchError } from '@supabase/supabase-js';

import { AuthService } from './AuthService';

jest.mock('../lib/supabase', () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn(),
      signUp: jest.fn(),
      resetPasswordForEmail: jest.fn(),
    },
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

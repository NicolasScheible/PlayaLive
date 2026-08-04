import {
  PASSWORD_MIN_LENGTH,
  isValidEmail,
  isValidPassword,
  passwordsMatch,
} from './authValidation';

describe('isValidEmail', () => {
  it('akzeptiert eine gültige E-Mail-Adresse', () => {
    expect(isValidEmail('nutzer@beispiel.de')).toBe(true);
  });

  it('lehnt eine E-Mail-Adresse ohne @ ab', () => {
    expect(isValidEmail('nutzer-beispiel.de')).toBe(false);
  });

  it('lehnt eine E-Mail-Adresse ohne Domain-Endung ab', () => {
    expect(isValidEmail('nutzer@beispiel')).toBe(false);
  });

  it('lehnt eine leere Eingabe ab', () => {
    expect(isValidEmail('')).toBe(false);
  });
});

describe('isValidPassword', () => {
  it('akzeptiert ein Passwort mit Mindestlänge', () => {
    expect(isValidPassword('a'.repeat(PASSWORD_MIN_LENGTH))).toBe(true);
  });

  it('lehnt ein zu kurzes Passwort ab', () => {
    expect(isValidPassword('a'.repeat(PASSWORD_MIN_LENGTH - 1))).toBe(false);
  });
});

describe('passwordsMatch', () => {
  it('erkennt identische Passwörter', () => {
    expect(passwordsMatch('geheim123', 'geheim123')).toBe(true);
  });

  it('erkennt unterschiedliche Passwörter', () => {
    expect(passwordsMatch('geheim123', 'anderesPasswort')).toBe(false);
  });
});

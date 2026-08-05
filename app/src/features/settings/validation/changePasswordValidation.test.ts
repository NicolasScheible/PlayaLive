import { PASSWORD_MIN_LENGTH, isValidPassword, passwordsMatch } from './changePasswordValidation';

describe('changePasswordValidation', () => {
  describe('isValidPassword', () => {
    it('lehnt zu kurze Passwörter ab', () => {
      expect(isValidPassword('a'.repeat(PASSWORD_MIN_LENGTH - 1))).toBe(false);
    });

    it('akzeptiert Passwörter mit Mindestlänge', () => {
      expect(isValidPassword('a'.repeat(PASSWORD_MIN_LENGTH))).toBe(true);
    });
  });

  describe('passwordsMatch', () => {
    it('erkennt übereinstimmende Passwörter', () => {
      expect(passwordsMatch('geheim123', 'geheim123')).toBe(true);
    });

    it('erkennt nicht übereinstimmende Passwörter', () => {
      expect(passwordsMatch('geheim123', 'anders456')).toBe(false);
    });
  });
});

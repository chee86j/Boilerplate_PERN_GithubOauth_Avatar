import { emailValidator, passwordValidator, usernameValidator } from './validators';

describe('usernameValidator', () => {
  test.each([
    ['', 'Username is required'],
    ['a', 'Username must be at least 2 characters long'],
    ['thisusernameiswaytoolong', 'Username must be less than 15 characters'],
    ['bad-name', 'Username can only contain letters, numbers, and underscores']
  ])('returns error for %s', (input, expected) => {
    expect(usernameValidator(input)).toBe(expected);
  });

  test('returns null for a valid username', () => {
    expect(usernameValidator('valid_user')).toBeNull();
  });
});

describe('passwordValidator', () => {
  test('returns null when password is empty', () => {
    expect(passwordValidator('')).toBeNull();
  });

  test.each([
    ['short1A!', 'Password must be at least 8 characters long'],
    ['NOLOWERCASE1!', 'Password must contain at least one lowercase letter'],
    ['nouppercase1!', 'Password must contain at least one uppercase letter'],
    ['NoNumber!!', 'Password must contain at least one number'],
    ['NoSpecial1', 'Password must contain at least one special character (@$!%*?&)']
  ])('returns error for %s', (input, expected) => {
    expect(passwordValidator(input)).toBe(expected);
  });

  test('returns null for a valid password', () => {
    expect(passwordValidator('Validpass1!')).toBeNull();
  });
});

describe('emailValidator', () => {
  test('returns error when email is empty', () => {
    expect(emailValidator('')).toBe('Email is required');
  });

  test('returns error for an invalid email', () => {
    expect(emailValidator('invalid-email')).toBe('Please enter a valid email address');
  });

  test('returns null for a valid email', () => {
    expect(emailValidator('user@example.com')).toBeNull();
  });
});

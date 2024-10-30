export interface PasswordValidation {
  hasLower: boolean;
  hasUpper: boolean;
  hasDigit: boolean;
  hasSpecial: boolean;
  hasLength: boolean;
}

export const validatePassword = (password: string): PasswordValidation => {
  return {
    hasLower: /[a-z]/.test(password),
    hasUpper: /[A-Z]/.test(password),
    hasDigit: /[0-9]/.test(password),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    hasLength: password.length >= 8
  };
};

export const isPasswordValid = (validation: PasswordValidation): boolean => {
  return Object.values(validation).every(value => value === true);
}; 
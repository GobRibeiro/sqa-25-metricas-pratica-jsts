export type PasswordRules = {
  minLength: number;
  maxLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSymbols: boolean;
  preventSequential: boolean;
  preventRepeating: boolean;
};

const DEFAULT_RULES: PasswordRules = {
  minLength: 8,
  maxLength: 128,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSymbols: true,
  preventSequential: true,
  preventRepeating: true,
};

const SEQUENTIAL_PATTERNS = [/123/, /abc/, /qwe/, /asd/, /zxc/];

function checkLength(password: string, rules: PasswordRules): string[] {
  const errors: string[] = [];
  if (password.length < rules.minLength) {
    errors.push(`Senha deve ter pelo menos ${rules.minLength} caracteres`);
  }
  if (rules.maxLength && password.length > rules.maxLength) {
    errors.push(`Senha deve ter no máximo ${rules.maxLength} caracteres`);
  }
  return errors;
}

function checkCharacterTypes(password: string, rules: PasswordRules): string[] {
  const validators: { rule: boolean; regex: RegExp; message: string }[] = [
    { rule: rules.requireUppercase, regex: /[A-Z]/, message: "Senha deve conter pelo menos uma letra maiúscula" },
    { rule: rules.requireLowercase, regex: /[a-z]/, message: "Senha deve conter pelo menos uma letra minúscula" },
    { rule: rules.requireNumbers, regex: /\d/, message: "Senha deve conter pelo menos um número" },
    { rule: rules.requireSymbols, regex: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]/, message: "Senha deve conter pelo menos um caractere especial" },
  ];

  return validators
    .filter((v) => v.rule && !v.regex.test(password))
    .map((v) => v.message);
}

function checkPatterns(password: string, rules: PasswordRules): string[] {
  const errors: string[] = [];
  if (rules.preventSequential && SEQUENTIAL_PATTERNS.some((p) => p.test(password.toLowerCase()))) {
    errors.push("Senha não deve conter sequências comuns");
  }
  if (rules.preventRepeating && /(.)\1{2,}/.test(password)) {
    errors.push("Senha não deve ter caracteres repetidos em excesso");
  }
  return errors;
}

export function validatePassword(
  password: string,
  rules: PasswordRules = DEFAULT_RULES
): boolean {
  const violations: string[] = [
    ...checkLength(password, rules),
    ...checkCharacterTypes(password, rules),
    ...checkPatterns(password, rules),
  ];

  return violations.length === 0;
}
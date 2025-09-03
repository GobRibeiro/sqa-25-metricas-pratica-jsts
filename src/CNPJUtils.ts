export class CNPJUtils {
  private static readonly CNPJ_CONSTANTS = {
    DIVISOR: 11,
    PARTIAL_LENGTH: 12,
    FIRST_VERIFIER_POSITION: 12,
    SECOND_VERIFIER_POSITION: 13,
    LENGTH: 14,
  };

  private static readonly FIRST_WEIGHTS = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  private static readonly SECOND_WEIGHTS = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

  private static clean(cnpj: string): string {
    return cnpj.replace(/\D/g, '');
  }

  private static calculateDigit(cnpj: string, weights: number[]): number {
    const sum = [...cnpj].reduce((acc, digit, index) => acc + parseInt(digit, 10) * weights[index], 0);
    const remainder = sum % this.CNPJ_CONSTANTS.DIVISOR;
    return remainder < 2 ? 0 : this.CNPJ_CONSTANTS.DIVISOR - remainder;
  }

  public static validateCNPJ(cnpj: string): boolean {
    const cleanCnpj = this.clean(cnpj);
    if (cleanCnpj.length !== this.CNPJ_CONSTANTS.LENGTH || /^(\d)\1{13}$/.test(cleanCnpj)) { return false };

    const firstDigit = this.calculateDigit(cleanCnpj.substring(0, this.CNPJ_CONSTANTS.PARTIAL_LENGTH), this.FIRST_WEIGHTS);
    const secondDigit = this.calculateDigit(cleanCnpj.substring(0, this.CNPJ_CONSTANTS.SECOND_VERIFIER_POSITION), this.SECOND_WEIGHTS);

    return cleanCnpj.endsWith(`${firstDigit}${secondDigit}`);
  }

  public static maskCNPJ(cnpj: string): string {
    const cleanCnpj = this.clean(cnpj);
    if (cleanCnpj.length !== this.CNPJ_CONSTANTS.LENGTH) {
      throw new Error('CNPJ deve ter 14 dígitos');
    }
    return cleanCnpj.replace(
      /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
      '$1.$2.$3/$4-$5'
    );
  }

  public static unmaskCNPJ(cnpj: string): string {
    return this.clean(cnpj);
  }

  public static generateValidCNPJ(): string {
    const randomDigits = Array.from({ length: 12 }, () => Math.floor(Math.random() * 10)).join('');
    const firstDigit = this.calculateDigit(randomDigits, this.FIRST_WEIGHTS);
    const secondDigit = this.calculateDigit(randomDigits + firstDigit, this.SECOND_WEIGHTS);
    return randomDigits + firstDigit + secondDigit;
  }

  //Validação de formato (completo ou parcial)
  public static isValidFormat(cnpj: string): boolean {
    const patterns = [
      /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/,
      /^\d{14}$/,
      /^\d{0,2}(\.\d{0,3})?(\.\d{0,3})?(\/\d{0,4})?(-\d{0,2})?$/,
    ];
    return patterns.some((regex) => regex.test(cnpj));
  }
}

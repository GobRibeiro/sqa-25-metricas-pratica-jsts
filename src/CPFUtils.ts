export class CPFUtils {

  private static readonly CONSTANTS = {
    CPF_LENGTH: 11,
    FIRST_WEIGHTS_LENGTH: 9,
    SECOND_WEIGHTS_LENGTH: 10,
    FIRST_WEIGHTS_START: 10,
    SECOND_WEIGHTS_START: 11,
  };

  private static readonly FIRST_DIGIT_WEIGHTS = this.generateFirstDigitWeights();
  private static readonly SECOND_DIGIT_WEIGHTS = this.generateSecondDigitWeights();

  private static generateFirstDigitWeights(): number[] {
    return Array.from({ length: this.CONSTANTS.FIRST_WEIGHTS_LENGTH }, (_, i) => this.CONSTANTS.FIRST_WEIGHTS_START - i);
  }

  private static generateSecondDigitWeights(): number[] {
    return Array.from({ length: this.CONSTANTS.SECOND_WEIGHTS_LENGTH }, (_, i) => this.CONSTANTS.SECOND_WEIGHTS_START - i);
  }

  private static clean(cpf: string): string {
    return cpf.replace(/\D/g, '');
  }

  private static calculateDigit(cpf: string, weights: number[]): number {
    const sum = [...cpf].reduce(
      (acc, digit, index) => acc + parseInt(digit, 10) * weights[index],
      0
    );
    const remainder = sum % this.CONSTANTS.CPF_LENGTH;
    return remainder < 2 ? 0 : this.CONSTANTS.CPF_LENGTH - remainder;
  }

  public static validateCPF(cpf: string): boolean {
    const cleanCpf = this.clean(cpf);

    if (cleanCpf.length !== this.CONSTANTS.CPF_LENGTH || /^(\d)\1{10}$/.test(cleanCpf)) { return false; }

    const firstDigit = this.calculateDigit(cleanCpf.substring(0, 9), this.FIRST_DIGIT_WEIGHTS );
    const secondDigit = this.calculateDigit(cleanCpf.substring(0, 10), this.SECOND_DIGIT_WEIGHTS);

    return cleanCpf.endsWith(`${firstDigit}${secondDigit}`);
  }

  public static maskCPF(cpf: string): string {
    const cleanCpf = this.clean(cpf);
    if (cleanCpf.length !== this.CONSTANTS.CPF_LENGTH) {
      throw new Error('CPF deve ter 11 dígitos');
    }

    return cleanCpf.replace(
      /^(\d{3})(\d{3})(\d{3})(\d{2})$/,
      '$1.$2.$3-$4'
    );
  }

  public static unmaskCPF(cpf: string): string {
    return this.clean(cpf);
  }

  public static generateValidCPF(): string {
    const randomDigits = Array.from({ length: 9 }, () => Math.floor(Math.random() * 10)).join('');
    const firstDigit = this.calculateDigit(randomDigits, this.FIRST_DIGIT_WEIGHTS);
    const secondDigit = this.calculateDigit(randomDigits + firstDigit, this.SECOND_DIGIT_WEIGHTS);

    return randomDigits + firstDigit + secondDigit;
  }

  //Validação de formato (completo ou parcial)
  public static isValidFormat(cpf: string): boolean {
    const patterns = [
      /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
      /^\d{11}$/,
      /^\d{0,3}(\.\d{0,3})?(\.\d{0,3})?(-\d{0,2})?$/,
    ];
    return patterns.some((regex) => regex.test(cpf));
  }
}

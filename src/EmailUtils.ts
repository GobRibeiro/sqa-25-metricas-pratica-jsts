export class EmailUtils {
  private static readonly CONSTANTS = {
    MAX_LOCAL_LENGTH: 64,
    MAX_DOMAIN_LENGTH: 253
  };


  public static validateEmail(email: string): boolean {
    const email_regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!email_regex.test(email)) { return false; }

    const [localPart, domain] = email.split('@');

    if (!this.validateLengths(localPart, domain)) {
      return false;
    }

    if (!this.validatePartFormats(localPart, domain)) {
      return false;
    }

    return true;
  }

  private static validateLengths(localPart: string, domain: string): boolean {
    return localPart.length <= this.CONSTANTS.MAX_LOCAL_LENGTH &&
      domain.length <= this.CONSTANTS.MAX_DOMAIN_LENGTH;
  }

  private static validatePartFormats(localPart: string, domain: string): boolean {
    const hasInvalidLocalPartFormat = localPart.startsWith('.') || localPart.endsWith('.') || localPart.includes('..');
    const hasInvaliddomainFormat = domain.startsWith('.') || domain.endsWith('.') || domain.includes('..');

    return !(hasInvalidLocalPartFormat || hasInvaliddomainFormat);
  }

  public static extractDomain(email: string): string | null {
    if (!this.validateEmail(email)) { return null; }
    return email.split('@')[1] || null;
  }

  public static extractLocalPart(email: string): string | null {
    if (!this.validateEmail(email)) { return null; }
    return email.split('@')[0] || null;
  }

  public static isFromDomain(email: string, domain: string): boolean {
    if (!this.validateEmail(email) || !domain) { return false; }

    const extractedDomain = this.extractDomain(email);
    if (!extractedDomain) { return false; }

    const emailDomain = extractedDomain.toLowerCase();
    const targetDomain = domain.toLowerCase();
    const emailParts = emailDomain.split('.');
    const domainParts = targetDomain.split('.');

    if (emailParts.length >= domainParts.length) {
      return emailParts.slice(-domainParts.length).join('.') === domainParts.join('.');
    }

    return false;
  }

  public static normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }
}

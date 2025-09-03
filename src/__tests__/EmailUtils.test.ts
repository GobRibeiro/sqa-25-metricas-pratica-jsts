import { EmailUtils } from "../EmailUtils";

describe("EmailUtils.validateEmail", () => {
  it("should validate a valid email", () => {
    const validEmail = "test@example.com";
    const result = EmailUtils.validateEmail(validEmail);
    expect(result).toBe(true);
  });

  it("should validate email with subdomain", () => {
    const validEmail = "user@sub.example.com";
    const result = EmailUtils.validateEmail(validEmail);
    expect(result).toBe(true);
  });

  it("should validate email with numbers", () => {
    const validEmail = "user123@example123.com";
    const result = EmailUtils.validateEmail(validEmail);
    expect(result).toBe(true);
  });

  it("should validate email with special characters", () => {
    const validEmail = "user.name+tag@example.com";
    const result = EmailUtils.validateEmail(validEmail);
    expect(result).toBe(true);
  });

  it("should reject email without @ symbol", () => {
    const invalidEmail = "testexample.com";
    const result = EmailUtils.validateEmail(invalidEmail);
    expect(result).toBe(false);
  });

  it("should reject email without domain", () => {
    const invalidEmail = "test@";
    const result = EmailUtils.validateEmail(invalidEmail);
    expect(result).toBe(false);
  });

  it("should reject email without local part", () => {
    const invalidEmail = "@example.com";
    const result = EmailUtils.validateEmail(invalidEmail);
    expect(result).toBe(false);
  });

  it("should reject email with invalid characters", () => {
    const invalidEmail = "test@example..com";
    const result = EmailUtils.validateEmail(invalidEmail);
    expect(result).toBe(false);
  });

  it("should reject email starting with dot", () => {
    const invalidEmail = ".test@example.com";
    const result = EmailUtils.validateEmail(invalidEmail);
    expect(result).toBe(false);
  });

  it("should reject email ending with dot", () => {
    const invalidEmail = "test.@example.com";
    const result = EmailUtils.validateEmail(invalidEmail);
    expect(result).toBe(false);
  });

  it("should reject email with domain starting with dot", () => {
    const invalidEmail = "test@.example.com";
    const result = EmailUtils.validateEmail(invalidEmail);
    expect(result).toBe(false);
  });

  it("should reject email with domain ending with dot", () => {
    const invalidEmail = "test@example.com.";
    const result = EmailUtils.validateEmail(invalidEmail);
    expect(result).toBe(false);
  });

  it("should handle empty string", () => {
    const result = EmailUtils.validateEmail("");
    expect(result).toBe(false);
  });

  it("should handle null input", () => {
    const result = EmailUtils.validateEmail(null as unknown as string);
    expect(result).toBe(false);
  });

  it("should handle undefined input", () => {
    const result = EmailUtils.validateEmail(undefined as unknown as string);
    expect(result).toBe(false);
  });
});

describe("EmailUtils.extractDomain", () => {
  it("should extract domain from valid email", () => {
    const email = "user@example.com";
    const result = EmailUtils.extractDomain(email);
    expect(result).toBe("example.com");
  });

  it("should extract domain with subdomain", () => {
    const email = "user@sub.example.com";
    const result = EmailUtils.extractDomain(email);
    expect(result).toBe("sub.example.com");
  });

  it("should return null for invalid email", () => {
    const invalidEmail = "invalid-email";
    const result = EmailUtils.extractDomain(invalidEmail);
    expect(result).toBe(null);
  });

  it("should handle email with multiple @ symbols", () => {
    const email = "user@example@domain.com";
    const result = EmailUtils.extractDomain(email);
    expect(result).toBe(null);
  });

  it("should handle null input", () => {
    const result = EmailUtils.extractDomain(null as unknown as string);
    expect(result).toBe(null);
  });

  it("should handle undefined input", () => {
    const result = EmailUtils.extractDomain(undefined as unknown as string);
    expect(result).toBe(null);
  });
});

describe("EmailUtils.extractLocalPart", () => {
  it("should extract local part from valid email", () => {
    const email = "user@example.com";
    const result = EmailUtils.extractLocalPart(email);
    expect(result).toBe("user");
  });

  it("should extract local part with dots", () => {
    const email = "user.name@example.com";
    const result = EmailUtils.extractLocalPart(email);
    expect(result).toBe("user.name");
  });

  it("should return null for invalid email", () => {
    const invalidEmail = "invalid-email";
    const result = EmailUtils.extractLocalPart(invalidEmail);
    expect(result).toBe(null);
  });

  it("should handle email with multiple @ symbols", () => {
    const email = "user@example@domain.com";
    const result = EmailUtils.extractLocalPart(email);
    expect(result).toBe(null);
  });

  it("should handle null input", () => {
    const result = EmailUtils.extractLocalPart(null as unknown as string);
    expect(result).toBe(null);
  });

  it("should handle undefined input", () => {
    const result = EmailUtils.extractLocalPart(undefined as unknown as string);
    expect(result).toBe(null);
  });
});

describe("EmailUtils.isFromDomain", () => {
  it("should return true for exact domain match", () => {
    const email = "user@example.com";
    const domain = "example.com";
    const result = EmailUtils.isFromDomain(email, domain);
    expect(result).toBe(true);
  });

  it("should return true for subdomain match", () => {
    const email = "user@sub.example.com";
    const domain = "example.com";
    const result = EmailUtils.isFromDomain(email, domain);
    expect(result).toBe(true);
  });

  it("should return false for different domain", () => {
    const email = "user@example.com";
    const domain = "other.com";
    const result = EmailUtils.isFromDomain(email, domain);
    expect(result).toBe(false);
  });

  it("should return false for invalid email", () => {
    const invalidEmail = "invalid-email";
    const domain = "example.com";
    const result = EmailUtils.isFromDomain(invalidEmail, domain);
    expect(result).toBe(false);
  });

  it("should return false for empty domain", () => {
    const email = "user@example.com";
    const domain = "";
    const result = EmailUtils.isFromDomain(email, domain);
    expect(result).toBe(false);
  });

  it("should handle case insensitive comparison", () => {
    const email = "user@EXAMPLE.COM";
    const domain = "example.com";
    const result = EmailUtils.isFromDomain(email, domain);
    expect(result).toBe(true);
  });

  it("should handle null email input", () => {
    const result = EmailUtils.isFromDomain(null as unknown as string, "domain");
    expect(result).toBe(false);
  });

  it("should handle undefined email input", () => {
    const result = EmailUtils.isFromDomain(undefined as unknown as string, "domain");
    expect(result).toBe(false);
  });

  it("should handle null domain input", () => {
    const result = EmailUtils.isFromDomain("user@example.com", null as unknown as string);
    expect(result).toBe(false);
  });

  it("should handle undefined domain input", () => {
    const result = EmailUtils.isFromDomain(
      "user@example.com",
      undefined as unknown as string
    );
    expect(result).toBe(false);
  });
});

describe("EmailUtils.normalizeEmail", () => {
  it("should normalize email to lowercase", () => {
    const email = "USER@EXAMPLE.COM";
    const result = EmailUtils.normalizeEmail(email);
    expect(result).toBe("user@example.com");
  });

  it("should trim whitespace", () => {
    const email = "  user@example.com  ";
    const result = EmailUtils.normalizeEmail(email);
    expect(result).toBe("user@example.com");
  });

  it("should handle mixed case", () => {
    const email = "User@Example.Com";
    const result = EmailUtils.normalizeEmail(email);
    expect(result).toBe("user@example.com");
  });

  it("should handle email with spaces", () => {
    const email = " user name @ example . com ";
    const result = EmailUtils.normalizeEmail(email);
    expect(result).toBe("user name @ example . com");
  });

  it("should handle null input", () => {
    expect(() => EmailUtils.normalizeEmail(null as unknown as string)).toThrow();
  });

  it("should handle undefined input", () => {
    expect(() => EmailUtils.normalizeEmail(undefined as unknown as string)).toThrow();
  });
});

describe("edge cases", () => {
  it("should handle very long emails", () => {
    const longLocalPart = "a".repeat(65);
    const longEmail = `${longLocalPart}@example.com`;
    const result = EmailUtils.validateEmail(longEmail);
    expect(result).toBe(false);
  });

  it("should handle very long domains", () => {
    const longDomain = "a".repeat(254);
    const longEmail = `user@${longDomain}.com`;
    const result = EmailUtils.validateEmail(longEmail);
    expect(result).toBe(false);
  });

  it("should handle special characters in local part", () => {
    const email = "user+tag@example.com";
    const result = EmailUtils.validateEmail(email);
    expect(result).toBe(true);
  });

  it("should handle consecutive dots in local part", () => {
    const email = "user..name@example.com";
    const result = EmailUtils.validateEmail(email);
    expect(result).toBe(false);
  });

  it("should handle consecutive dots in domain", () => {
    const email = "user@example..com";
    const result = EmailUtils.validateEmail(email);
    expect(result).toBe(false);
  });
});
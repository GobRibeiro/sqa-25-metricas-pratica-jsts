import { CNPJUtils } from "../CNPJUtils";

const CNPJ_LENGTH = 14;
const LONG_STRING_SIZE = 100;

describe("CNPJUtils.validateCNPJ", () => {
  it("should validate a valid CNPJ", () => {
    const validCNPJ = "11.222.333/0001-81";
    const result = CNPJUtils.validateCNPJ(validCNPJ);
    expect(result).toBe(true);
  });

  it("should validate a valid CNPJ without mask", () => {
    const validCNPJ = "11222333000181";
    const result = CNPJUtils.validateCNPJ(validCNPJ);
    expect(result).toBe(true);
  });

  it("should reject CNPJ with invalid length", () => {
    const invalidCNPJ = "123456789";
    const result = CNPJUtils.validateCNPJ(invalidCNPJ);
    expect(result).toBe(false);
  });

  it("should reject CNPJ with all same digits", () => {
    const invalidCNPJ = "11111111111111";
    const result = CNPJUtils.validateCNPJ(invalidCNPJ);
    expect(result).toBe(false);
  });

  it("should reject invalid CNPJ", () => {
    const invalidCNPJ = "11.222.333/0001-82";
    const result = CNPJUtils.validateCNPJ(invalidCNPJ);
    expect(result).toBe(false);
  });

  it("should handle empty string", () => {
    const result = CNPJUtils.validateCNPJ("");
    expect(result).toBe(false);
  });

  it("should handle null input", () => {
    expect(() => CNPJUtils.validateCNPJ(null as unknown as string)).toThrow();
  });

  it("should handle undefined input", () => {
    expect(() => CNPJUtils.validateCNPJ(undefined as unknown as string)).toThrow();
  });
});

describe("CNPJUtils.maskCNPJ", () => {
  it("should mask a valid CNPJ", () => {
    const unmaskedCNPJ = "11222333000181";
    const expected = "11.222.333/0001-81";
    const result = CNPJUtils.maskCNPJ(unmaskedCNPJ);
    expect(result).toBe(expected);
  });

  it("should mask CNPJ with existing mask", () => {
    const maskedCNPJ = "11.222.333/0001-81";
    const result = CNPJUtils.maskCNPJ(maskedCNPJ);
    expect(result).toBe(maskedCNPJ);
  });

  it("should throw error for invalid length", () => {
    const invalidCNPJ = "123456789";
    expect(() => CNPJUtils.maskCNPJ(invalidCNPJ)).toThrow(
      "CNPJ deve ter 14 dígitos"
    );
  });

  it("should handle CNPJ with special characters", () => {
    const cnpjWithSpecialChars = "11-222-333/0001-81";
    const expected = "11.222.333/0001-81";
    const result = CNPJUtils.maskCNPJ(cnpjWithSpecialChars);
    expect(result).toBe(expected);
  });

  it("should handle null input", () => {
    expect(() => CNPJUtils.maskCNPJ(null as unknown as string)).toThrow();
  });

  it("should handle undefined input", () => {
    expect(() => CNPJUtils.maskCNPJ(undefined as unknown as string)).toThrow();
  });
});

describe("CNPJUtils.unmaskCNPJ", () => {
  it("should remove mask from CNPJ", () => {
    const maskedCNPJ = "11.222.333/0001-81";
    const expected = "11222333000181";
    const result = CNPJUtils.unmaskCNPJ(maskedCNPJ);
    expect(result).toBe(expected);
  });

  it("should return same string if no mask", () => {
    const unmaskedCNPJ = "11222333000181";
    const result = CNPJUtils.unmaskCNPJ(unmaskedCNPJ);
    expect(result).toBe(unmaskedCNPJ);
  });

  it("should handle CNPJ with mixed characters", () => {
    const mixedCNPJ = "11-222.333/0001-81";
    const expected = "11222333000181";
    const result = CNPJUtils.unmaskCNPJ(mixedCNPJ);
    expect(result).toBe(expected);
  });

  it("should handle null input", () => {
    expect(() => CNPJUtils.unmaskCNPJ(null as unknown as string)).toThrow();
  });

  it("should handle undefined input", () => {
    expect(() => CNPJUtils.unmaskCNPJ(undefined as unknown as string)).toThrow();
  });
});

describe("CNPJUtils.generateValidCNPJ", () => {
  it("should generate a valid CNPJ", () => {
    const result = CNPJUtils.generateValidCNPJ();
    expect(result).toHaveLength(CNPJ_LENGTH);
    expect(CNPJUtils.validateCNPJ(result)).toBe(true);
  });

  it("should generate different CNPJs on multiple calls", () => {
    const cnpj1 = CNPJUtils.generateValidCNPJ();
    const cnpj2 = CNPJUtils.generateValidCNPJ();
    expect(cnpj1).not.toBe(cnpj2);
  });

  it("should generate only numeric characters", () => {
    const result = CNPJUtils.generateValidCNPJ();
    expect(result).toMatch(/^\d+$/);
  });
});

describe("CNPJUtils.isValidFormat", () => {
  it("should validate masked format", () => {
    const maskedCNPJ = "11.222.333/0001-81";
    const result = CNPJUtils.isValidFormat(maskedCNPJ);
    expect(result).toBe(true);
  });

  it("should validate unmasked format", () => {
    const unmaskedCNPJ = "11222333000181";
    const result = CNPJUtils.isValidFormat(unmaskedCNPJ);
    expect(result).toBe(true);
  });

  it("should validate partial format", () => {
    const partialCNPJ = "11.222";
    const result = CNPJUtils.isValidFormat(partialCNPJ);
    expect(result).toBe(true);
  });

  it("should reject invalid format", () => {
    const invalidCNPJ = "11.222.333/0001-8A";
    const result = CNPJUtils.isValidFormat(invalidCNPJ);
    expect(result).toBe(false);
  });

  it("should handle empty string", () => {
    const result = CNPJUtils.isValidFormat("");
    expect(result).toBe(true);
  });

  it("should handle null input", () => {
    const result = CNPJUtils.isValidFormat(null as unknown as string);
    expect(result).toBe(false);
  });

  it("should handle undefined input", () => {
    const result = CNPJUtils.isValidFormat(undefined as unknown as string);
    expect(result).toBe(false);
  });
});

describe("edge cases", () => {
  it("should handle very long strings", () => {
    const longString = "1".repeat(LONG_STRING_SIZE);
    expect(CNPJUtils.validateCNPJ(longString)).toBe(false);
    expect(() => CNPJUtils.maskCNPJ(longString)).toThrow();
  });

  it("should handle special characters", () => {
    const specialChars = "!@#$%^&*()";
    expect(CNPJUtils.validateCNPJ(specialChars)).toBe(false);
    expect(() => CNPJUtils.maskCNPJ(specialChars)).toThrow();
  });
});


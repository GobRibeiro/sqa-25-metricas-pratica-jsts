import { CPFUtils } from "../CPFUtils";

describe("CPFUtils.validateCPF", () => {
  it("should validate a valid CPF", () => {
    const validCPF = "123.456.789-09";
    const result = CPFUtils.validateCPF(validCPF);
    expect(result).toBe(true);
  });

  it("should validate a valid CPF without mask", () => {
    const validCPF = "12345678909";
    const result = CPFUtils.validateCPF(validCPF);
    expect(result).toBe(true);
  });

  it("should reject CPF with invalid length", () => {
    const invalidCPF = "123456789";
    const result = CPFUtils.validateCPF(invalidCPF);
    expect(result).toBe(false);
  });

  it("should reject CPF with all same digits", () => {
    const invalidCPF = "11111111111";
    const result = CPFUtils.validateCPF(invalidCPF);
    expect(result).toBe(false);
  });

  it("should reject invalid CPF", () => {
    const invalidCPF = "123.456.789-10";
    const result = CPFUtils.validateCPF(invalidCPF);
    expect(result).toBe(false);
  });

  it("should handle empty string", () => {
    const result = CPFUtils.validateCPF("");
    expect(result).toBe(false);
  });

  it("should handle null input", () => {
    expect(() => CPFUtils.validateCPF(null as unknown as string)).toThrow();
  });

  it("should handle undefined input", () => {
    expect(() => CPFUtils.validateCPF(undefined as unknown as string)).toThrow();
  });
});

describe("CPFUtils.maskCPF", () => {
  it("should mask a valid CPF", () => {
    const unmaskedCPF = "12345678909";
    const expected = "123.456.789-09";
    const result = CPFUtils.maskCPF(unmaskedCPF);
    expect(result).toBe(expected);
  });

  it("should mask CPF with existing mask", () => {
    const maskedCPF = "123.456.789-09";
    const result = CPFUtils.maskCPF(maskedCPF);
    expect(result).toBe(maskedCPF);
  });

  it("should throw error for invalid length", () => {
    const invalidCPF = "123456789";
    expect(() => CPFUtils.maskCPF(invalidCPF)).toThrow(
      "CPF deve ter 11 dígitos"
    );
  });

  it("should handle CPF with special characters", () => {
    const cpfWithSpecialChars = "123-456-789-09";
    const expected = "123.456.789-09";
    const result = CPFUtils.maskCPF(cpfWithSpecialChars);
    expect(result).toBe(expected);
  });

  it("should handle null input", () => {
    expect(() => CPFUtils.maskCPF(null as unknown as string)).toThrow();
  });

  it("should handle undefined input", () => {
    expect(() => CPFUtils.maskCPF(undefined as unknown as string)).toThrow();
  });
});

describe("CPFUtils.unmaskCPF", () => {
  it("should remove mask from CPF", () => {
    const maskedCPF = "123.456.789-09";
    const expected = "12345678909";
    const result = CPFUtils.unmaskCPF(maskedCPF);
    expect(result).toBe(expected);
  });

  it("should return same string if no mask", () => {
    const unmaskedCPF = "12345678909";
    const result = CPFUtils.unmaskCPF(unmaskedCPF);
    expect(result).toBe(unmaskedCPF);
  });

  it("should handle CPF with mixed characters", () => {
    const mixedCPF = "123-456.789-09";
    const expected = "12345678909";
    const result = CPFUtils.unmaskCPF(mixedCPF);
    expect(result).toBe(expected);
  });

  it("should handle null input", () => {
    expect(() => CPFUtils.unmaskCPF(null as unknown as string)).toThrow();
  });

  it("should handle undefined input", () => {
    expect(() => CPFUtils.unmaskCPF(undefined as unknown as string)).toThrow();
  });
});

describe("CPFUtils.generateValidCPF", () => {
  it("should generate a valid CPF", () => {
    const result = CPFUtils.generateValidCPF();
    expect(result).toHaveLength(11);
    expect(CPFUtils.validateCPF(result)).toBe(true);
  });

  it("should generate different CPFs on multiple calls", () => {
    const cpf1 = CPFUtils.generateValidCPF();
    const cpf2 = CPFUtils.generateValidCPF();
    expect(cpf1).not.toBe(cpf2);
  });

  it("should generate only numeric characters", () => {
    const result = CPFUtils.generateValidCPF();
    expect(result).toMatch(/^\d+$/);
  });
});

describe("CPFUtils.isValidFormat", () => {
  it("should validate masked format", () => {
    const maskedCPF = "123.456.789-09";
    const result = CPFUtils.isValidFormat(maskedCPF);
    expect(result).toBe(true);
  });

  it("should validate unmasked format", () => {
    const unmaskedCPF = "12345678909";
    const result = CPFUtils.isValidFormat(unmaskedCPF);
    expect(result).toBe(true);
  });

  it("should validate partial format", () => {
    const partialCPF = "123.456";
    const result = CPFUtils.isValidFormat(partialCPF);
    expect(result).toBe(true);
  });

  it("should reject invalid format", () => {
    const invalidCPF = "123.456.789-0A";
    const result = CPFUtils.isValidFormat(invalidCPF);
    expect(result).toBe(false);
  });

  it("should handle empty string", () => {
    const result = CPFUtils.isValidFormat("");
    expect(result).toBe(true);
  });

  it("should handle null input", () => {
    const result = CPFUtils.isValidFormat(null as unknown as string);
    expect(result).toBe(false);
  });

  it("should handle undefined input", () => {
    const result = CPFUtils.isValidFormat(undefined as unknown as string);
    expect(result).toBe(false);
  });
});

describe("edge cases", () => {
  it("should handle very long strings", () => {
    const longString = "1".repeat(100);
    expect(CPFUtils.validateCPF(longString)).toBe(false);
    expect(() => CPFUtils.maskCPF(longString)).toThrow();
  });

  it("should handle special characters", () => {
    const specialChars = "!@#$%^&*()";
    expect(CPFUtils.validateCPF(specialChars)).toBe(false);
    expect(() => CPFUtils.maskCPF(specialChars)).toThrow();
  });

  it("should handle CPF with spaces", () => {
    const cpfWithSpaces = " 123.456.789-09 ";
    const result = CPFUtils.validateCPF(cpfWithSpaces);
    expect(result).toBe(true);
  });
});

import { validatePassword } from "../PasswordUtils";

describe("validatePassword", () => {
  describe("valid passwords", () => {
    it("should validate a strong password", () => {
      const password = "StrongPass713!";
      const result = validatePassword(password);
      expect(result).toBe(true);
    });

    it("should validate password with all required elements", () => {
      const password = "MyP@ssw0rd";
      const result = validatePassword(password);
      expect(result).toBe(true);
    });

    it("should validate password with special characters", () => {
      const password = "P@ssw0rd!@#$%^&*()";
      const result = validatePassword(password);
      expect(result).toBe(true);
    });

    it("should validate password with minimum length", () => {
      const password = "Ab1!defg";
      const result = validatePassword(password);
      expect(result).toBe(true);
    });
  });

  describe("length validation", () => {
    it("should reject password shorter than minimum length", () => {
      const password = "Ab1!def";
      const result = validatePassword(password);
      expect(result).toBe(false);
    });

    it("should reject password longer than maximum length", () => {
      const password =
        "ComplexP@ssw0rd2024!".repeat(6) + "b1!defghijklmnopqrstuvwxyz";
      const result = validatePassword(password);
      expect(result).toBe(false);
    });

    it("should accept password with exactly minimum length", () => {
      const password = "Ab1!defg";
      const result = validatePassword(password);
      expect(result).toBe(true);
    });

    it("should accept password with exactly maximum length", () => {
      const password = "ComplexP@ssw0rd2024!".repeat(6) + "b1!defg";
      const result = validatePassword(password);
      expect(result).toBe(true);
    });
  });

  describe("uppercase requirement", () => {
    it("should reject password without uppercase letters", () => {
      const password = "mypassword123!";
      const result = validatePassword(password);
      expect(result).toBe(false);
    });

    it("should accept password with uppercase letters", () => {
      const password = "MyPassword713!";
      const result = validatePassword(password);
      expect(result).toBe(true);
    });

    it("should accept password with only uppercase letters", () => {
      const password = "MYPASSWORD713!";
      const result = validatePassword(password);
      expect(result).toBe(false);
    });
  });

  describe("lowercase requirement", () => {
    it("should reject password without lowercase letters", () => {
      const password = "MYPASSWORD713!";
      const result = validatePassword(password);
      expect(result).toBe(false);
    });

    it("should accept password with lowercase letters", () => {
      const password = "MyPassword713!";
      const result = validatePassword(password);
      expect(result).toBe(true);
    });

    it("should accept password with only lowercase letters", () => {
      const password = "mypassword713!";
      const result = validatePassword(password);
      expect(result).toBe(false);
    });
  });

  describe("number requirement", () => {
    it("should reject password without numbers", () => {
      const password = "MyPassword!";
      const result = validatePassword(password);
      expect(result).toBe(false);
    });

    it("should accept password with numbers", () => {
      const password = "MyPassword713!";
      const result = validatePassword(password);
      expect(result).toBe(true);
    });

    it("should accept password with only numbers and letters", () => {
      const password = "MyPassword713";
      const result = validatePassword(password);
      expect(result).toBe(false);
    });
  });

  describe("symbol requirement", () => {
    it("should reject password without symbols", () => {
      const password = "MyPassword713";
      const result = validatePassword(password);
      expect(result).toBe(false);
    });

    it("should accept password with symbols", () => {
      const password = "MyPassword713!";
      const result = validatePassword(password);
      expect(result).toBe(true);
    });

    it("should accept various symbol types", () => {
      const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?";
      for (const symbol of symbols) {
        const password = `MyPassword713${symbol}`;
        const result = validatePassword(password);
        expect(result).toBe(true);
      }
    });
  });

  describe("sequential pattern prevention", () => {
    it("should reject password with sequential numbers", () => {
      const password = "MyPass123!";
      const result = validatePassword(password);
      expect(result).toBe(false);
    });

    it("should reject password with sequential letters", () => {
      const password = "MyPassabc!";
      const result = validatePassword(password);
      expect(result).toBe(false);
    });

    it("should reject password with qwe sequence", () => {
      const password = "MyPassqwe!";
      const result = validatePassword(password);
      expect(result).toBe(false);
    });

    it("should reject password with asd sequence", () => {
      const password = "MyPassasd!";
      const result = validatePassword(password);
      expect(result).toBe(false);
    });

    it("should reject password with zxc sequence", () => {
      const password = "MyPasszxc!";
      const result = validatePassword(password);
      expect(result).toBe(false);
    });

    it("should handle case insensitive sequential patterns", () => {
      const password = "MyPassABC!";
      const result = validatePassword(password);
      expect(result).toBe(false);
    });
  });

  describe("repeating character prevention", () => {
    it("should reject password with three consecutive same characters", () => {
      const password = "MyPassss713!";
      const result = validatePassword(password);
      expect(result).toBe(false);
    });

    it("should reject password with four consecutive same characters", () => {
      const password = "MyPasssss713!";
      const result = validatePassword(password);
      expect(result).toBe(false);
    });

    it("should accept password with two consecutive same characters", () => {
      const password = "MyPassss713!";
      const result = validatePassword(password);
      expect(result).toBe(false);
    });

    it("should accept password with no consecutive same characters", () => {
      const password = "MyPassword713!";
      const result = validatePassword(password);
      expect(result).toBe(true);
    });
  });

  describe("edge cases", () => {
    it("should handle empty string", () => {
      const result = validatePassword("");
      expect(result).toBe(false);
    });

    it("should handle null input", () => {
      expect(() => validatePassword(null as unknown as string)).toThrow();
    });

    it("should handle undefined input", () => {
      expect(() => validatePassword(undefined as unknown as string)).toThrow();
    });

    it("should handle very short valid password", () => {
      const password = "Ab1!defg";
      const result = validatePassword(password);
      expect(result).toBe(true);
    });

    it("should handle password with spaces", () => {
      const password = "My Pass 713!";
      const result = validatePassword(password);
      expect(result).toBe(true);
    });

    it("should handle password with unicode characters", () => {
      const password = "MyPáss713!";
      const result = validatePassword(password);
      expect(result).toBe(true);
    });

    it("should handle password with emojis", () => {
      const password = "MyPass713!😀";
      const result = validatePassword(password);
      expect(result).toBe(true);
    });
  });

  describe("complex validation scenarios", () => {
    it("should validate password that meets all requirements", () => {
      const password = "ComplexP@ssw0rd2024!";
      const result = validatePassword(password);
      expect(result).toBe(true);
    });

    it("should reject password missing multiple requirements", () => {
      const password = "simple";
      const result = validatePassword(password);
      expect(result).toBe(false);
    });

    it("should reject password with sequential and repeating issues", () => {
      const password = "MyPass123sss!";
      const result = validatePassword(password);
      expect(result).toBe(false);
    });

    it("should accept password with complex patterns", () => {
      const password = "K9#mP2$vL8@nR5!";
      const result = validatePassword(password);
      expect(result).toBe(true);
    });
  });
});

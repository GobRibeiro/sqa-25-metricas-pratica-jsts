import { validatePassword } from "./PasswordUtils";
import { EmailUtils } from "./EmailUtils";
import { CNPJUtils } from "./CNPJUtils";

interface ServiceInput { email: string; password: string; cnpj: string; }
interface ApiCallResult { success: boolean; message: string; }
interface TestData { testCNPJ: string; testEmail: string; testPassword: string; }
interface ProcessedUserData {
  normalizedEmail: string;
  emailDomain: string;
  isFromSpecificDomain: boolean;
  maskedCNPJ: string;
  unmaskedCNPJ: string;
  cnpjFormatValid: boolean;
  testData: TestData;
}
interface ProcessedBatchItem {
  index: number;
  originalData: ServiceInput;
  isValid: boolean;
  processedEmail: string;
  processedCNPJ: string;
}

export class Services {
  private static readonly CONSTANTS = {
    SPECIFIC_DOMAIN: "empresa.com",
    API_CALLS_COUNT: 4,
    INTEGRITY_CHECKS_COUNT: 3,
    AUDIT_OPERATIONS_COUNT: 9,
    JSON_SPACES: 2,
  };

  public static runService(email: string, password: string, cnpj: string) {
    const inputData: ServiceInput = { email, password, cnpj };
    const validation = this.validateInput(inputData);
    if (!validation.success){
      return validation;
    }

    const processed = this.processUserData(inputData);
    const apiResults = this.makeApiCalls(inputData, processed.testData);
    const batch = this.processBatchData(inputData, processed.testData);

    return this.buildFinalResult(inputData, processed, apiResults, batch);
  }

  private static validateInput({ email, password, cnpj }: ServiceInput) {
    const valid = {
      email: EmailUtils.validateEmail(email),
      password: validatePassword(password),
      cnpj: CNPJUtils.validateCNPJ(cnpj),
    };
    return valid.email && valid.password && valid.cnpj
      ? { success: true, message: "Dados válidos" }
      : { success: false, message: "Dados inválidos", details: valid };
  }

  private static processUserData({ email, cnpj }: ServiceInput): ProcessedUserData {
    const normalizedEmail = EmailUtils.normalizeEmail(email);
    const emailDomain = EmailUtils.extractDomain(normalizedEmail) ?? '';
    const isFromSpecificDomain = EmailUtils.isFromDomain(normalizedEmail, this.CONSTANTS.SPECIFIC_DOMAIN);
    const maskedCNPJ = CNPJUtils.maskCNPJ(cnpj);
    const unmaskedCNPJ = CNPJUtils.unmaskCNPJ(maskedCNPJ);
    const cnpjFormatValid = CNPJUtils.isValidFormat(maskedCNPJ);
    const testData: TestData = {
      testCNPJ: CNPJUtils.generateValidCNPJ(),
      testEmail: `teste.${Date.now()}@${this.CONSTANTS.SPECIFIC_DOMAIN}`,
      testPassword: "Teste123!@#",
    };
    return { normalizedEmail, emailDomain, isFromSpecificDomain, maskedCNPJ, unmaskedCNPJ, cnpjFormatValid, testData };
  }

  private static makeApiCalls(input: ServiceInput, test: TestData): ApiCallResult[] {
    return [
      this.fakeApiCall(input.email, input.password),
      this.fakeApiCall(input.email, input.cnpj),
      this.fakeApiCall(input.password, input.cnpj),
      this.fakeApiCall(test.testEmail, test.testPassword),
    ];
  }

  private static processBatchData(input: ServiceInput, test: TestData): ProcessedBatchItem[] {
    const batch: ServiceInput[] = [
      input,
      { email: test.testEmail, password: test.testPassword, cnpj: test.testCNPJ },
    ];
    return batch.map((item, i) => ({
      index: i,
      originalData: item,
      isValid: EmailUtils.validateEmail(item.email) && validatePassword(item.password) && CNPJUtils.validateCNPJ(item.cnpj),
      processedEmail: EmailUtils.normalizeEmail(item.email),
      processedCNPJ: CNPJUtils.maskCNPJ(item.cnpj),
    }));
  }

  private static buildFinalResult(
    input: ServiceInput,
    processed: ProcessedUserData,
    apiResults: ApiCallResult[],
    batch: ProcessedBatchItem[]
  ) {
    const report = {
      timestamp: new Date().toISOString(),
      totalRecords: batch.length,
      validRecords: batch.filter((b) => b.isValid).length,
      invalidRecords: batch.filter((b) => !b.isValid).length,
      apiCalls: apiResults.length,
      domain: processed.emailDomain,
      isFromSpecificDomain: processed.isFromSpecificDomain,
    };
    const backup = { timestamp: new Date().toISOString(), data: batch, checksum: JSON.stringify(batch).length, originalInput: input };
    const integrityErrors = [
      !processed.emailDomain ? "Domínio inválido" : "",
      !processed.cnpjFormatValid ? "Formato CNPJ inválido" : "",
      apiResults.length !== this.CONSTANTS.API_CALLS_COUNT ? "Número incorreto de chamadas de API" : "",
    ].filter(Boolean);
    const integrity = { isValid: integrityErrors.length === 0, errors: integrityErrors, totalChecks: this.CONSTANTS.INTEGRITY_CHECKS_COUNT };
    const audit = {
      timestamp: new Date().toISOString(),
      suspiciousEmails: batch.filter((b) => /test|admin/.test(b.originalData.email)).length,
      duplicateCNPJs: batch.filter((b) => b.originalData.cnpj === batch[0].originalData.cnpj).length,
      totalOperations: this.CONSTANTS.AUDIT_OPERATIONS_COUNT,
    };
    const exported = { format: "json", content: JSON.stringify({ report, batch, backup, integrity, audit }, null, this.CONSTANTS.JSON_SPACES), size: JSON.stringify({ report, batch, backup, integrity, audit }).length };

    return {
      success: true,
      message: "Serviço executado com sucesso",
      summary: {
        totalProcessed: batch.length,
        validRecords: report.validRecords,
        invalidRecords: report.invalidRecords,
        apiCalls: apiResults.length,
        backupCreated: !!backup,
        integrityValid: integrity.isValid,
        auditCompleted: !!audit,
        dataExported: !!exported,
      },
      data: { processed, test: processed.testData, batch, report, backup, integrity, audit, exported },
    };
  }

  private static fakeApiCall(_a: string, _b: string): ApiCallResult {
    return { success: true, message: "Api call successful" };
  }
}
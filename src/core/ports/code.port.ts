export const CodePort = Symbol("CodePort");

export interface CodePort {
  generateRandomCode(length: number): string;
  verifyCodeAndCodeChallenge(codeVerifier: string, codeChallenge: string): boolean;
}

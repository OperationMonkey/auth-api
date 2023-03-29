export const CodePort = Symbol("CodePort");

export interface CodePort {
  generateRandomCode(length: number): string;
  verifyCodeAgainstChallenge(codeVerifier: string, codeChallenge: string): boolean;
}

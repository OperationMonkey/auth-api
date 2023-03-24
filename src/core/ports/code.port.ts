export const CodePort = Symbol("CodePort");

export interface CodePort {
  generateRandomCode(): Promise<string>;
  verifyCodeAgainstChallenge(codeVerifier: string, codeChallenge: string): boolean;
}

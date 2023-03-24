import { Injectable } from "@nestjs/common";

import type { CodePort } from "../core/ports/code.port";

@Injectable()
export class CodeAdapter implements CodePort {
  public generateRandomCode(): Promise<string> {
    throw new Error("Method not implemented.");
  }

  public verifyCodeAgainstChallenge(_codeVerifier: string, _codeChallenge: string): boolean {
    throw new Error("Method not implemented.");
  }

  private base64(buffer: Buffer): string {
    // https://www.w3schools.com/jsref/jsref_replace.asp
    return buffer.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
  }
}

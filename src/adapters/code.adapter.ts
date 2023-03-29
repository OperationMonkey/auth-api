import { createHash, randomBytes } from "crypto";

import { Injectable } from "@nestjs/common";

import type { CodePort } from "../core/ports/code.port";

@Injectable()
export class CodeAdapter implements CodePort {
  public generateRandomCode(length: number): string {
    return `${new Date().getTime().toString()}-${this.base64Encode(
      randomBytes(Math.floor(length))
    )}`;
  }

  public verifyCodeAgainstChallenge(codeVerifier: string, codeChallenge: string): boolean {
    const hash = this.base64Encode(createHash("sha256").update(codeVerifier).digest());

    return hash === codeChallenge ? true : false;
  }

  private base64Encode(buffer: Buffer): string {
    // https://www.w3schools.com/jsref/jsref_replace.asp
    return buffer.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
  }
}

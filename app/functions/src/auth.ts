import "dotenv/config";
import {logger} from "firebase-functions/v1";

class AuthHandler {
  private static instance: AuthHandler;
  private accessToken: string | null = null;
  private validUntil: number | null = null;

  static getInstance(): AuthHandler {
    if (!AuthHandler.instance) {
      AuthHandler.instance = new AuthHandler();
    }
    return AuthHandler.instance;
  }

  async authorize() {
    const result = await fetch("https://www.reddit.com/api/v1/access_token?grant_type=client_credentials", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization":
          "Basic " + Buffer.from(process.env.CLIENT_ID + ":" + process.env.CLIENT_SECRET).toString("base64"),
      },
    });

    if (!result.ok) {
      logger.log(result.status.toString());
      logger.log(result.statusText.toString());
      logger.log(await result.text());
      return;
    }

    const body = await result.json();
    this.accessToken = body.access_token;
    this.validUntil = Date.now() + body.expires_in * 1000;
  }

  isAuthorized(): boolean {
    return this.accessToken !== null && this.validUntil !== null && this.validUntil > Date.now();
  }

  async getAccessToken(): Promise<string> {
    if (!this.isAuthorized()) {
      await this.authorize();
    }

    return this.accessToken as string;
  }
}

export const authHandler = AuthHandler.getInstance();

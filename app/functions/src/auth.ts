import {defineString} from "firebase-functions/params";
import {logger} from "firebase-functions/v1";

const clientId = defineString("CLIENT_ID");
const clientSecret = defineString("CLIENT_SECRET");

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
          "Basic " + Buffer.from(clientId.value() + ":" + clientSecret.value()).toString("base64"),
        "User-Agent": "firebase:redditclient-80ec9:v0.1 (by /u/udolf_seelenfrost)",
      },
    });

    if (!result.ok) {
      logger.log("Auth: " + result.status.toString());
      logger.log("Auth: " + result.statusText.toString());
      logger.log("Auth clientId: " + clientId.value());
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

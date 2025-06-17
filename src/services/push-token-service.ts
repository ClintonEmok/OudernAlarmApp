import { httpClient } from "./http-client";
import { Capacitor } from "@capacitor/core";

class PushTokenService {
  async register(token: string) {
    return httpClient.post("/push-tokens", {
      token,
      platform: Capacitor.getPlatform(),
      app_version: "1.0.0", // optionally use App.getInfo()
    });
  }

  async remove(token: string) {
    return httpClient.delete("/push-tokens", {
      token,
    });
  }
}

export const pushTokenService = new PushTokenService();

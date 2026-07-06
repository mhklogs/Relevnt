import { createApp } from "../app";

let app: ReturnType<typeof createApp> | null = null;

export default async function handler(req: any, res: any) {
  if (!app) {
    try {
      app = createApp();
    } catch (err: any) {
      console.error("Failed to create app:", err);
      res.status(500).json({
        error: "Server initialization failed.",
        details: err?.message || String(err)
      });
      return;
    }
  }
  app(req, res);
}

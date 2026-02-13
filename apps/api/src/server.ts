import "dotenv/config";
import { buildApp } from "./app.js";

const app = buildApp();

// VERCEL: Export the handler for serverless execution
export default async (req: any, res: any) => {
  await app.ready();
  app.server.emit('request', req, res);
};

// LOCAL: Only run app.listen if NOT in a Vercel environment
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  const start = async () => {
    try {
      await app.listen({
        port: 3001,
        host: "0.0.0.0"
      });
      console.log("Server running at http://localhost:3001");
    } catch (err) {
      app.log.error(err);
      process.exit(1);
    }
  };
  start();
}
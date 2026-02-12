import Fastify from "fastify";
import txRoutes from "./routes/tx.routes";
import cors from "@fastify/cors";
export function buildApp() {
  const app = Fastify({
    logger: true
  });
  app.register(cors, {
    origin: "http://localhost:3000"
  });

  app.get("/health", async () => {
    return { status: "ok" };
  });
app.register(txRoutes);   
  return app;
}

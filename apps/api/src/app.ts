import Fastify from "fastify";
import txRoutes from "./routes/tx.routes";

export function buildApp() {
  const app = Fastify({
    logger: true
  });

  app.get("/health", async () => {
    return { status: "ok" };
  });
app.register(txRoutes);   
  return app;
}

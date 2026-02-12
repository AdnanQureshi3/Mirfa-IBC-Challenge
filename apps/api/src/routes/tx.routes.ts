import { FastifyPluginAsync } from "fastify";
import { encryptTx, getTx } from "../services/tx.service";

const txRoutes: FastifyPluginAsync = async (app) => {
  app.post("/tx/encrypt", async (request) => {
    
    const { partyId, payload } = request.body as any;
    return encryptTx(app, partyId, payload);
  });

  app.get("/tx/:id", async (request, reply) => {
    const { id } = request.params as any;
    const record = getTx(app, id);

    if (!record) {
      return reply.status(404).send({ error: "Not found" });
    }

    return record;
  });
};

export default txRoutes;

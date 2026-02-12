import { FastifyPluginAsync } from "fastify";
import { encryptTx, getTx , decryptTx} from "../services/tx.service.js";

const txRoutes: FastifyPluginAsync = async (app) => {
  app.post("/tx/encrypt", async (request) => {

    const { partyId, payload } = request.body as any;
    return encryptTx(partyId, payload);
  });

  app.get("/tx/:id", async (request, reply) => {
    const { id } = request.params as any;
    const record = getTx(id);

    if (!record) {
      return reply.status(404).send({ error: "Not found" });
    }

    return record;
  });

  app.get("/tx/:id/decrypt", async (request, reply) => {
    const { id } = request.params as any;
    try {
      const decrypted = decryptTx(id);
      return decrypted;
    }
    catch (e) {
      return reply.status(404).send({ error: "Not found or decryption failed" });
    } 
    });

}
export default txRoutes;

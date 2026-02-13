import { buildApp } from "../src/app.js"; // Point this to your existing app logic

const app = buildApp();

export default async (req: any, res: any) => {
  await app.ready();
  app.server.emit('request', req, res);
};
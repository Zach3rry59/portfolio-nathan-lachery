import { migrateCv } from "./services/migrate-cv.js";
import { migrateProjectDetails } from "./services/migrate-project-details.js";
import { migrateProjectCaptures } from "./services/migrate-project-captures.js";
import { createApp } from "./app.js";
import { config } from "./config/env.js";
import { connectDatabase, disconnectDatabase } from "./config/database.js";
const server = createApp().listen(config.port, config.host, () => {
  console.log(`API : http://${config.host}:${config.port}`);
  if (!config.mongoUri)
    console.log(
      "MongoDB non configuré : projets de référence disponibles, contacts indisponibles.",
    );
});
server.on("error", async (error) => {
  console.error(`Impossible de démarrer l’API (${error.code || "erreur"}).`);
  try {
    await disconnectDatabase();
  } catch (cleanupError) {
    console.error(
      `Impossible de nettoyer la base : ${cleanupError?.message || cleanupError}.`,
    );
  }
  process.exit(1);
});
void connectDatabase(config.mongoUri, async () => {
  await migrateCv();
  await migrateProjectDetails();
  await migrateProjectCaptures();
});
async function shutdown() {
  await new Promise((resolve, reject) =>
    server.close((err) => (err ? reject(err) : resolve())),
  );
  await disconnectDatabase();
}
process.once("SIGINT", shutdown);
process.once("SIGTERM", shutdown);

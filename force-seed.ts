import { seedBootstrapAdmin } from "./lib/bootstrap";

async function forceSeed() {
  console.log("Starting force seed...");
  await seedBootstrapAdmin();
  console.log("Force seed complete.");
  process.exit(0);
}

forceSeed().catch(console.error);

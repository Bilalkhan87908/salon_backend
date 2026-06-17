const { spawnSync, spawn } = require("child_process");

const allMigrations = [
  "20260603072631_init",
  "20260603074921_add_product_fields",
  "20260603101618_add_salon_id_to_offers",
  "20260603130725_add_user_booking_to_platform_payments",
  "20260603134649_add_booking_relation_to_platform_payments",
  "20260604162000_patch_existing_mysql_schema",
  "20260605102000_fix_notification_and_profile_schema",
];

function run(command, args, options = {}) {
  return spawnSync(command, args, {
    stdio: "inherit",
    shell: process.platform === "win32",
    ...options,
  });
}

function baseline() {
  const check = run("npx", ["prisma", "migrate", "deploy"]);
  if (check.status === 0) return;

  console.log("[startup] migrate deploy failed, attempting baseline...");

  for (const name of allMigrations) {
    run("npx", ["prisma", "migrate", "resolve", "--applied", name]);
  }
}

function deployMigrations() {
  const result = run("npx", ["prisma", "migrate", "deploy"]);
  if (result.status !== 0) {
    console.log("[startup] migrate deploy failed after baseline, trying db push...");
    const push = run("npx", ["prisma", "db", "push", "--accept-data-loss"]);
    if (push.status !== 0) {
      process.exit(push.status || 1);
    }
  }
}

function bootstrapDemoData() {
  const result = run("node", ["scripts/bootstrap-demo-data.cjs"]);
  if (result.status !== 0) {
    console.log("[startup] Demo data bootstrap skipped after non-fatal error.");
  }
}

function startServer() {
  const child = spawn("node", ["dist/server.js"], {
    stdio: "inherit",
    shell: process.platform === "win32",
    env: process.env,
  });

  child.on("exit", (code) => {
    process.exit(code || 0);
  });
}

baseline();
deployMigrations();
bootstrapDemoData();
startServer();

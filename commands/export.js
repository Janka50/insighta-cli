"use strict";

const fs   = require("fs");
const path = require("path");
const { exportProfiles }  = require("../lib/api");
const { displayError }    = require("../lib/display");
const { loadCredentials } = require("../lib/config");

async function exportCsv(options) {
  const creds = loadCredentials();
  if (!creds) {
    console.error("❌ Not logged in. Run: insighta login");
    process.exit(1);
  }

  if (creds.role !== "admin") {
    console.error("❌ Export is restricted to admin users only.");
    process.exit(1);
  }

  const params = {};
  if (options.gender)  params.gender     = options.gender;
  if (options.country) params.country_id = options.country;
  if (options.ageGroup)params.age_group  = options.ageGroup;
  if (options.minAge)  params.min_age    = options.minAge;
  if (options.maxAge)  params.max_age    = options.maxAge;

  const filename = options.output || `profiles_${Date.now()}.csv`;
  const filepath = path.resolve(process.cwd(), filename);

  try {
    console.log("\n📥 Exporting profiles to CSV...\n");
    const csv = await exportProfiles(params);

    fs.writeFileSync(filepath, csv);
    const lines = csv.split("\n").length - 1;
    console.log(`✅ Exported ${lines} profiles to: ${filepath}\n`);
  } catch (err) {
    if (err.response?.status === 403) {
      console.error("❌ Access denied. Admin role required.");
    } else {
      displayError(err);
    }
    process.exit(1);
  }
}

module.exports = { exportCsv };
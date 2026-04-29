"use strict";

const { searchProfiles }            = require("../lib/api");
const { displayProfiles, displayMeta, displayError } = require("../lib/display");
const { loadCredentials }           = require("../lib/config");

async function search(query, options) {
  const creds = loadCredentials();
  if (!creds) {
    console.error("❌ Not logged in. Run: insighta login");
    process.exit(1);
  }

  if (!query || query.trim() === "") {
    console.error('❌ Please provide a search query. Example: insighta search "young males"');
    process.exit(1);
  }

  const params = {};
  if (options.page)  params.page  = options.page;
  if (options.limit) params.limit = options.limit;

  try {
    console.log(`\n🔍 Searching for: "${query}"\n`);
    const result = await searchProfiles(query, params);

    if (result.status === "error") {
      console.error(`❌ ${result.message}`);
      return;
    }

    displayMeta(result);
    displayProfiles(result.data);
    console.log();
  } catch (err) {
    displayError(err);
    process.exit(1);
  }
}

module.exports = { search };
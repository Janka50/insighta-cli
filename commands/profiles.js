"use strict";

const { getProfiles }               = require("../lib/api");
const { displayProfiles, displayMeta, displayError } = require("../lib/display");
const { loadCredentials }           = require("../lib/config");

async function profiles(options) {
  const creds = loadCredentials();
  if (!creds) {
    console.error("❌ Not logged in. Run: insighta login");
    process.exit(1);
  }

  const params = {};
  if (options.gender)               params.gender     = options.gender;
  if (options.country)              params.country_id = options.country;
  if (options.ageGroup)             params.age_group  = options.ageGroup;
  if (options.minAge)               params.min_age    = options.minAge;
  if (options.maxAge)               params.max_age    = options.maxAge;
  if (options.sortBy)               params.sort_by    = options.sortBy;
  if (options.order)                params.order      = options.order;
  if (options.page)                 params.page       = options.page;
  if (options.limit)                params.limit      = options.limit;
  if (options.minGenderProbability) params.min_gender_probability  = options.minGenderProbability;
  if (options.minCountryProbability)params.min_country_probability = options.minCountryProbability;

  try {
    console.log("\n📋 Fetching profiles...\n");
    const result = await getProfiles(params);

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

module.exports = { profiles };
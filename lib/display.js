"use strict";

const Table = require("cli-table3");

function displayProfiles(data) {
  if (!data || data.length === 0) {
    console.log("No profiles found.");
    return;
  }

  const table = new Table({
    head: ["Name", "Gender", "Age", "Age Group", "Country", "Confidence"],
    colWidths: [20, 10, 6, 12, 20, 12],
    style: { head: ["cyan"] },
  });

  data.forEach((p) => {
    table.push([
      p.name || "-",
      p.gender || "-",
      p.age ?? "-",
      p.age_group || "-",
      p.country_name || p.country_id || "-",
      p.gender_probability ? `${(p.gender_probability * 100).toFixed(0)}%` : "-",
    ]);
  });

  console.log(table.toString());
}

function displayMeta(result) {
  console.log(
    `\nShowing page ${result.page} of results | Total: ${result.total} | Limit: ${result.limit}\n`
  );
}

function displayError(err) {
  if (err.response?.data?.message) {
    console.error(`Error: ${err.response.data.message}`);
  } else if (err.message) {
    console.error(`Error: ${err.message}`);
  } else {
    console.error("An unexpected error occurred.");
  }
}

module.exports = { displayProfiles, displayMeta, displayError };
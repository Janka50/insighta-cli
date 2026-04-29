"use strict";

const { loadCredentials, isTokenExpired } = require("../lib/config");

function whoami() {
  const creds = loadCredentials();
  if (!creds) {
    console.log("\n❌ Not logged in. Run: insighta login\n");
    return;
  }

  const expired = isTokenExpired(creds);
  console.log("\n👤 Current Session:");
  console.log(`   Username : ${creds.username}`);
  console.log(`   Role     : ${creds.role}`);
  console.log(`   Token    : ${expired ? "⚠️  Expired (will auto-refresh)" : "✅ Valid"}`);
  console.log(`   Expires  : ${new Date(creds.expiry).toLocaleString()}\n`);
}

module.exports = { whoami };
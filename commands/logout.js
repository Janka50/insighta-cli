"use strict";

const { clearCredentials, loadCredentials } = require("../lib/config");

function logout() {
  const creds = loadCredentials();
  if (!creds) {
    console.log("ℹ️  You are not logged in.");
    return;
  }
  clearCredentials();
  console.log("\n✅ Logged out successfully. Credentials cleared.\n");
}

module.exports = { logout };
"use strict";

const http    = require("http");
const crypto  = require("crypto");
const axios   = require("axios");
const { saveCredentials } = require("../lib/config");

const BASE_URL   = process.env.INSIGHTA_API_URL || "https://gender-api-hng.onrender.com";
const LOCAL_PORT = 9876;
const CALLBACK   = `http://localhost:${LOCAL_PORT}/callback`;

async function login() {
  console.log("\n🔐 Starting GitHub OAuth login...\n");

  // Build login URL pointing to backend with cli=true
  const loginUrl = `${BASE_URL}/api/v1/auth/github/login?cli=true`;

  // Try to open browser automatically
  try {
    const open = (await import("open")).default;
    await open(loginUrl);
    console.log("✅ Browser opened. Complete login in your browser.");
    console.log("   If browser did not open, visit this URL manually:");
  } catch {
    console.log("📋 Open this URL in your browser:");
  }

  console.log(`\n   ${loginUrl}\n`);
  console.log("⏳ Waiting for authentication...\n");

  // Since backend returns JSON for cli=true, user needs to paste the token
  // Start a local server to catch manual paste, OR ask user to paste token
  await waitForManualPaste();
}

async function waitForManualPaste() {
  const readline = require("readline");
  const rl = readline.createInterface({
    input:  process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    console.log("📋 After logging in, copy the JSON response from your browser.");
    console.log("   Paste the access_token value below:\n");

    rl.question("Access Token: ", async (access_token) => {
      rl.question("Refresh Token: ", async (refresh_token) => {
        rl.question("Role (admin/analyst): ", async (role) => {
          rl.question("Username: ", async (username) => {
            rl.close();

            if (!access_token || !refresh_token) {
              console.error("\n❌ Invalid input. Login cancelled.");
              process.exit(1);
            }

            saveCredentials({
              access_token:  access_token.trim(),
              refresh_token: refresh_token.trim(),
              role:          role.trim() || "analyst",
              username:      username.trim() || "unknown",
              expiry:        Date.now() + 15 * 60 * 1000,
            });

            console.log(`\n✅ Logged in as ${username.trim()} (${role.trim()})`);
            console.log("   Credentials saved to ~/.insighta/credentials.json\n");
            resolve();
          });
        });
      });
    });
  });
}

module.exports = { login };
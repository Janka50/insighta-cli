"use strict";

const fs   = require("fs");
const path = require("path");
const os   = require("os");

const CONFIG_DIR  = path.join(os.homedir(), ".insighta");
const CONFIG_FILE = path.join(CONFIG_DIR, "credentials.json");

function ensureDir() {
  if (!fs.existsSync(CONFIG_DIR)) {
    fs.mkdirSync(CONFIG_DIR, { recursive: true });
  }
}

function saveCredentials(data) {
  ensureDir();
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(data, null, 2));
}

function loadCredentials() {
  if (!fs.existsSync(CONFIG_FILE)) return null;
  try {
    return JSON.parse(fs.readFileSync(CONFIG_FILE, "utf8"));
  } catch {
    return null;
  }
}

function clearCredentials() {
  if (fs.existsSync(CONFIG_FILE)) {
    fs.unlinkSync(CONFIG_FILE);
  }
}

function isTokenExpired(credentials) {
  if (!credentials || !credentials.expiry) return true;
  return Date.now() >= credentials.expiry;
}

module.exports = { saveCredentials, loadCredentials, clearCredentials, isTokenExpired };
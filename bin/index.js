#!/usr/bin/env node
"use strict";

const { Command } = require("commander");
const { login }     = require("../commands/login");
const { logout }    = require("../commands/logout");
const { whoami }    = require("../commands/whoami");
const { profiles }  = require("../commands/profiles");
const { search }    = require("../commands/search");
const { exportCsv } = require("../commands/export");

const program = new Command();

program
  .name("insighta")
  .description("CLI tool for Insighta Labs+ API")
  .version("1.0.0");

// ── insighta login ────────────────────────────────────────────────────────────
program
  .command("login")
  .description("Login with GitHub OAuth")
  .action(async () => {
    await login();
  });

// ── insighta logout ───────────────────────────────────────────────────────────
program
  .command("logout")
  .description("Logout and clear credentials")
  .action(() => {
    logout();
  });

// ── insighta whoami ───────────────────────────────────────────────────────────
program
  .command("whoami")
  .description("Show current logged in user")
  .action(() => {
    whoami();
  });

// ── insighta profiles ─────────────────────────────────────────────────────────
program
  .command("profiles")
  .description("List profiles with optional filters")
  .option("--gender <gender>",                   "Filter by gender (male/female)")
  .option("--country <country_id>",              "Filter by country code (e.g. NG, US)")
  .option("--age-group <age_group>",             "Filter by age group (child/teenager/adult/senior)")
  .option("--min-age <min_age>",                 "Minimum age")
  .option("--max-age <max_age>",                 "Maximum age")
  .option("--sort-by <sort_by>",                 "Sort by: age, created_at, gender_probability")
  .option("--order <order>",                     "Sort order: asc or desc")
  .option("--page <page>",                       "Page number (default: 1)")
  .option("--limit <limit>",                     "Results per page (default: 10, max: 50)")
  .option("--min-gender-probability <value>",    "Minimum gender probability (0-1)")
  .option("--min-country-probability <value>",   "Minimum country probability (0-1)")
  .action(async (options) => {
    await profiles(options);
  });

// ── insighta search ───────────────────────────────────────────────────────────
program
  .command("search <query>")
  .description('Natural language search (e.g. "young males from nigeria")')
  .option("--page <page>",   "Page number")
  .option("--limit <limit>", "Results per page")
  .action(async (query, options) => {
    await search(query, options);
  });

// ── insighta export ───────────────────────────────────────────────────────────
program
  .command("export")
  .description("Export profiles to CSV (admin only)")
  .option("--gender <gender>",     "Filter by gender")
  .option("--country <country_id>","Filter by country code")
  .option("--age-group <group>",   "Filter by age group")
  .option("--min-age <min_age>",   "Minimum age")
  .option("--max-age <max_age>",   "Maximum age")
  .option("--output <filename>",   "Output filename (default: profiles_<timestamp>.csv)")
  .action(async (options) => {
    await exportCsv(options);
  });

program.parse(process.argv);

// Show help if no command given
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
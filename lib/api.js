"use strict";

const axios  = require("axios");
const { loadCredentials, saveCredentials, isTokenExpired } = require("./config");

const BASE_URL = process.env.INSIGHTA_API_URL || "https://gender-api-hng.onrender.com";

// Create axios instance
const client = axios.create({ baseURL: BASE_URL });

// Auto-attach token to every request
client.interceptors.request.use((config) => {
  const creds = loadCredentials();
  if (creds && creds.access_token) {
    config.headers.Authorization = `Bearer ${creds.access_token}`;
  }
  return config;
});

// Auto-refresh token on 401
client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      const creds = loadCredentials();
      if (!creds?.refresh_token) {
        console.error("Session expired. Please run: insighta login");
        process.exit(1);
      }
      try {
        const res = await axios.post(`${BASE_URL}/api/v1/auth/refresh`, {
          refresh_token: creds.refresh_token,
        });
        const newToken = res.data.access_token;
        saveCredentials({
          ...creds,
          access_token: newToken,
          expiry: Date.now() + 15 * 60 * 1000,
        });
        original.headers.Authorization = `Bearer ${newToken}`;
        return client(original);
      } catch {
        console.error("Session expired. Please run: insighta login");
        process.exit(1);
      }
    }
    return Promise.reject(error);
  }
);

async function getProfiles(params = {}) {
  const res = await client.get("/api/v1/profiles", { params });
  return res.data;
}

async function searchProfiles(q, params = {}) {
  const res = await client.get("/api/v1/profiles/search", { params: { q, ...params } });
  return res.data;
}

async function exportProfiles(params = {}) {
  const res = await client.get("/api/v1/profiles/export", {
    params,
    responseType: "text",
  });
  return res.data;
}

async function refreshToken(refresh_token) {
  const res = await axios.post(`${BASE_URL}/api/v1/auth/refresh`, { refresh_token });
  return res.data;
}

module.exports = { getProfiles, searchProfiles, exportProfiles, refreshToken };
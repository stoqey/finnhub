// Envs
require("dotenv").config();

export const isDev = process.env.NODE_ENV !== "production";

const { env } = process;

export const forceLog = env.FORCE_LOG || false;

export const FINNHUB_KEY = env.FINNHUB_KEY || "";

/**
 * @tutorial TIMEZONE_ON
 * Check if market is open before calling websocket
 */
export const TZ_ON = env.TZ_ON;

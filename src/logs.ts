import debug from "debug";

const loggingPrefix = "finnhub";

/**
 * Use to log in general case
 */
export const log = debug(`${loggingPrefix}:info`);

/**
 * Use for verbose log
 */
export const verbose = debug(`${loggingPrefix}:verbose`);

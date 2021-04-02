import "mocha";

import { expect } from "chai";
import dotenv from "dotenv";

import FinnhubAPI from "./";

dotenv.config();

const finnHubKey = (process && process.env.FINNHUB_KEY) || "";

console.log("finnHubKey", finnHubKey);

const finnhubAPI = new FinnhubAPI(finnHubKey);

const symbol = "AAPL";

const startDATE = new Date();
const startDate = new Date(startDATE.setDate(startDATE.getDate() - 4));
const endDate = new Date();

describe("FinnhubAPI", () => {
  it("should get candles in the passed 4 days for " + symbol, async () => {
    const candles = await finnhubAPI.getCandles(
      symbol,
      startDate,
      endDate,
      "1",
    );
    console.log("candles", candles && candles[candles.length - 1]);
    console.log("candles length", candles && candles.length);
    expect(candles).not.to.be.empty;
  });

  // it("should timeout after 4 secs" + symbol, async () => {
  //   const startDate = new Date("2020-03-28T04:00:00.000Z");
  //   const endDate = new Date("2020-03-30T04:00:00.000Z");
  //   const candles = await finnhubAPI.getCandles(
  //     symbol,
  //     startDate,
  //     endDate,
  //     "1",
  //   );
  //   console.log("candles", candles);
  //   console.log("candles length", candles && candles.length);
  //   expect(candles).not.to.be.empty;
  // });

  it("should get ticks for a symbol = " + symbol, async () => {
    const ticks = await finnhubAPI.getTick(symbol, startDate);
    console.log("ticks", ticks && ticks[ticks.length - 1]);
    console.log("ticks length", ticks && ticks.length);
    return expect(ticks.length).not.equals(0);
  });

  it("should get quote for a symbol = " + symbol, async () => {
    const quote = await finnhubAPI.getQuote(symbol);
    return expect(quote.close).not.equals(0);
  });

  it("should get Company Profile for symbol = " + symbol, async () => {
    const companyProfile = await finnhubAPI.getCompanyProfile2(symbol);
    console.log(companyProfile);
    return expect(companyProfile.country).not.equal("");
  });


  it("should get Recommendation Trends for symbol = " + symbol, async () => {
    const recommendations = await finnhubAPI.GetRecommendationTrends(symbol);
    console.log(recommendations);
    return expect(recommendations[0].buy).not.equal(0);

  it("should get Company peers =" + symbol, async () => {
    const peers = await finnhubAPI.getPeers(symbol);
    console.log("peers", peers);
    return expect(peers.length).greaterThan(0);
  });
});

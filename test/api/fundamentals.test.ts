import { expect } from "chai";
import dotenv from "dotenv";
import "mocha";
import { SymbolLookup } from "../../src/api/fundamentals/interface";
import FinnhubAPI from "../../src/index";

dotenv.config();
const finnHubKey = (process && process.env.FINNHUB_KEY) || "";
console.log("finnHubKey", finnHubKey);

const finnhubAPI = new FinnhubAPI(finnHubKey);
const symbol = "AAPL";

/**
 * https://finnhub.io/docs/api/symbol-search
 */
describe("Symbol lookup", () => {
  it("Query for google and expect result as in docs ", async () => {
    const expectedRes: SymbolLookup = {
      count: 12,
      result: [
        {
          description: "GLOBAL X MSCI PORTUGAL ETF",
          displaySymbol: "PGAL",
          symbol: "PGAL",
          type: "ETP",
        },
        {
          description: "SHANDONG MOLONG PETROLEUM-H",
          displaySymbol: "SHANF",
          symbol: "SHANF",
          type: "Common Stock",
        },
        {
          description: "ICMTRADER  Google Inc",
          displaySymbol: "GOOGL/USD",
          symbol: "ICMTRADER:152",
          type: "US Equities (CFDs)",
        },
        {
          description: "GOLD BOND GROUP LTD/THE",
          displaySymbol: "GOLD.TA",
          symbol: "GOLD.TA",
          type: "Common Stock",
        },
        {
          description: "SDM GROUP HOLDINGS LIMITED",
          displaySymbol: "8363.HK",
          symbol: "8363.HK",
          type: "Common Stock",
        },
        {
          description: "GLOBAL X MSCI PORTUGAL ETF",
          displaySymbol: "4GXV.BE",
          symbol: "4GXV.BE",
          type: "ETP",
        },
        {
          description: "SHANDONG MOLONG PETROLEUM-A",
          displaySymbol: "002490.SZ",
          symbol: "002490.SZ",
          type: "Common Stock",
        },
        {
          description: "SHANDONG MOLONG PETROLEUM-H",
          displaySymbol: "PXI.F",
          symbol: "PXI.F",
          type: "Common Stock",
        },
        {
          description: "BRD-GROUPE SOCIETE GENERALE",
          displaySymbol: "0KVH.L",
          symbol: "0KVH.L",
          type: "Common Stock",
        },
        {
          description: "XINJIANG GUOTONG PIPELINE-A",
          displaySymbol: "002205.SZ",
          symbol: "002205.SZ",
          type: "Common Stock",
        },
        {
          description: "SHANDONG MOLONG PETROLEUM-H",
          displaySymbol: "PXI.MU",
          symbol: "PXI.MU",
          type: "Common Stock",
        },
        {
          description: "SHANDONG MOLONG PETROLEUM-H",
          displaySymbol: "PXI.SG",
          symbol: "PXI.SG",
          type: "Common Stock",
        },
      ],
    };
    const res = await finnhubAPI.symbolLookup("google");

    // TODO: Find a better way to compare these objects
    expect(res.count).equal(expectedRes.count);
  });

  it("Query for nothing and expect a very big object of size 7218", async () => {
    const expectedSize = 7218;
    const res = await finnhubAPI.symbolLookup();
    expect(res.count).equal(expectedSize);
  });

  it("Query for empty string and expect a very big object of size 7218", async () => {
    const expectedSize = 7218;
    const res = await finnhubAPI.symbolLookup("");
    expect(res.count).equal(expectedSize);
  });
});

describe("Company Profile2", () => {
  it("should get Company Profile for symbol = " + symbol, async () => {
    const companyProfile = await finnhubAPI.getCompanyProfile2(symbol);
    return expect(companyProfile.country).not.equal("");
  });
});

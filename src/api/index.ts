import axios, { AxiosInstance } from "axios";
import { isEmpty } from "lodash";

import {
  Candles,
  MarketDataItem,
  Quote,
  RecommendationTrends,
  Resolution,
  TickData,
} from "../interface";
import Fundamentals from "./fundamentals/fundamentals";
import {
  CompanyProfile2,
  CompanyProfile2Request,
  MarketNews,
  MarketNewsRequest,
  SymbolLookup,
} from "./fundamentals/interface";
import { getPeers } from "./peers";
import { getQuoteData } from "./quote";
import { GetRecommendationTrends } from "./stockEstimates";
import { getTickData } from "./tick";
const round = (num: number) => Math.round(num);

/**
 * FinnhubAPI
 * @StockCandles Get candlestick data for stocks.
 * https://finnhub.io/docs/api#stock-candles
 *
 * @TickData Get historical tick data for US stocks from all 13 exchanges
 * https://finnhub.io/docs/api#stock-tick
 *
 * @Quote Get stocks quote price
 * https://finnhub.io/docs/api#quote
 *
 * @CompanyProfile2 Get symbol Company info
 * https://finnhub.io/docs/api/company-profile2
 *
 * @RecommendationTrends Get Recommendation Trends
 * https://finnhub.io/docs/api/recommendation-trends
 * @Peers Get peers for company
 * https://finnhub.io/docs/api/company-peers
 */
export class FinnhubAPI {
  public token: string;

  public api: AxiosInstance;

  private fundamentalsApi: Fundamentals;

  constructor(token?: string) {
    this.api = axios.create({
      baseURL: "https://finnhub.io/api/v1",
    });
    this.token = token
      ? token
      : (process && process.env && process.env.FINNHUB_KEY) || "";

    this.fundamentalsApi = new Fundamentals(this);
  }

  /**
   * Get candlestick data for stocks.
   * @param symbol
   * @param start
   * @param end
   * @param resolution
   * https://finnhub.io/docs/api#stock-candles
   */
  public async getCandles(
    symbol: string,
    start: Date,
    end: Date,
    resolution: Resolution,
  ): Promise<MarketDataItem[]> {
    const token = this.token;
    const to = end.getTime() / 1000;
    const from = start.getTime() / 1000;

    //  const url = `https://finnhub.io/api/v1/stock/candle?symbol=${symbol}&resolution=${range}&from=${from}&to=${to}&token=${FINNHUB_KEY}`
    const params = {
      to: round(to),
      from: round(from),
      symbol,
      token,
      resolution,
    };

    if (isNaN(from) || isNaN(to)) {
      console.log("error with parameters", { from, to });
      return [];
    }

    try {
      // TODO check lastime we pulled this symbol, else fetch it's data again
      const candles = await this.api.get(`stock/candle`, {
        method: "GET",
        params,
      });

      const data: Candles = candles.data;

      const closes = data.c;

      const marketData = isEmpty(closes)
        ? []
        : data.c.map((cc, index) => {
            const close = cc; // a.k.
            const open = data.o[index];
            const time = data.t[index];
            const volume = data.v[index];
            const high = data.h[index];
            const low = data.l[index];
            return {
              close,
              date: new Date(+time * 1000),
              volume,
              open,
              high,
              low,
            };
          });

      return marketData;
    } catch (error) {
      console.log("error getting candles", error && error.message);
      return [];
    }
  }

  /**
   * TickData Get historical tick data for US stocks from all 13 exchanges
   * https://finnhub.io/docs/api#stock-tick
   * @param symbol
   * @param date
   */
  public async getTick(symbol: string, date: Date): Promise<TickData[]> {
    return getTickData({ symbol, date, context: this });
  }

  /**
   * GetQuote
   * Get real-time quote data for US stocks. Constant polling is not recommended. Use websocket if you need real-time update.
   * @param symbol
   */
  public async getQuote(symbol: string): Promise<Quote> {
    return getQuoteData({ symbol, context: this });
  }

  /**
   * Symbol Lookup
   * Search for best-matching symbols based on your query. You can input anything from symbol, security's name to ISIN and Cusip.
   * @param query Query text can be symbol, name, isin, or cusip
   * @returns SymbolLookup
   */
  public async symbolLookup(query?: string): Promise<SymbolLookup> {
    return this.fundamentalsApi.symbolLookup(query);
  }

  /**
   * companyProfile2
   * Get general information of a company
   * https://finnhub.io/docs/api/company-profile2
   * @param args @type {CompanyProfile2Request}
   * @return {CompanyProfile2}
   */
  public async companyProfile2(
    args: CompanyProfile2Request,
  ): Promise<CompanyProfile2> {
    return this.fundamentalsApi.companyProfile2(args);
  }

  public async marketNews(args: MarketNewsRequest): Promise<MarketNews[]> {
    return this.fundamentalsApi.marketNews(args);
  }

  /**
   * GetRecommendationTrends
   * Get general information of a company
   * https://finnhub.io/docs/api/company-profile2
   */
  public async GetRecommendationTrends(
    symbol: string,
  ): Promise<RecommendationTrends[]> {
    return GetRecommendationTrends({ symbol, context: this });
  }

  /**
   * GetPeers
   * Get company peers. Return a list of peers in the same country and GICS sub-industry
   * @param symbol
   */
  public async getPeers(symbol: string): Promise<string[]> {
    return getPeers({ symbol, context: this });
  }
}

export default FinnhubAPI;

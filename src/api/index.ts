import axios, { AxiosInstance } from "axios";
import { isEmpty } from "lodash";
import {
  Candles,
  CompanyProfile,
  MarketDataItem,
  Quote,
  RecommendationTrends,
  Resolution,
  TickData,
} from "../interface";
import { getCompanyProfile2Data } from "./fundamentals";
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
 * @CompanyProfile2 get symbol Company info
 * https://finnhub.io/docs/api/company-profile2
 *
 * @RecommendationTrends Get Recommendation Trends
 * https://finnhub.io/docs/api/recommendation-trends
 */
export class FinnhubAPI {
  public token: string;

  public api: AxiosInstance;

  constructor(token?: string) {
    this.api = axios.create({
      baseURL: "https://finnhub.io/api/v1",
    });
    this.token = token
      ? token
      : (process && process.env && process.env.FINNHUB_KEY) || "";
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
   * GetCompanyProfile
   * Get general information of a company
   * https://finnhub.io/docs/api/company-profile2
   */
  public async getCompanyProfile2(symbol: string): Promise<CompanyProfile> {
    return getCompanyProfile2Data({ symbol, context: this });
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
}

export default FinnhubAPI;

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
  BasicFinancials,
  BasicFinancialsRequest,
  CompanyNews,
  CompanyNewsRequest,
  CompanyProfile2,
  CompanyProfile2Request,
  MarketNews,
  MarketNewsRequest,
  NewsSentiment,
  SymbolLookup,
} from "./fundamentals/interface";
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
   * @returns {SymbolLookup | null}
   */
  public async symbolLookup(query?: string): Promise<SymbolLookup | null> {
    return this.fundamentalsApi.symbolLookup(query);
  }

  /**
   * companyProfile2
   * Get general information of a company
   * https://finnhub.io/docs/api/company-profile2
   * @param args @type {CompanyProfile2Request}
   * @return {CompanyProfile2 | null}
   */
  public async companyProfile2(
    args: CompanyProfile2Request,
  ): Promise<CompanyProfile2 | null> {
    return this.fundamentalsApi.companyProfile2(args);
  }

  /**
   * Market News - https://finnhub.io/docs/api/market-news
   * Get latest market news.
   * @param args @type {MarketNewsRequest}
   * @returns {MarketNews | null}
   */
  public async marketNews(
    args: MarketNewsRequest,
  ): Promise<MarketNews[] | null> {
    return this.fundamentalsApi.marketNews(args);
  }

  /**
   * Company News - https://finnhub.io/docs/api/company-news
   * List latest company news by symbol. This endpoint is only available for North American companies.
   * @param args @type {CompanyNewsRequest}
   * @returns {CompanyNews | null}
   */
  public async companyNews(
    args: CompanyNewsRequest,
  ): Promise<CompanyNews[] | null> {
    return this.fundamentalsApi.companyNews(args);
  }

  /**
   * News Sentiment - https://finnhub.io/docs/api/news-sentiment
   * Get company's news sentiment and statistics. This endpoint is only available for US companies.
   * @param symbol
   * @returns {NewsSentiment | null}
   */
  public async newsSentiment(symbol: string): Promise<NewsSentiment | null> {
    return this.fundamentalsApi.newsSentiment(symbol);
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
   * Peers - https://finnhub.io/docs/api/company-peers
   * Get company peers. Return a list of peers in the same country and GICS sub-industry
   * @param symbol Symbol of the company
   * @returns Array of peers' symbol.
   */
  public async peers(symbol: string): Promise<string[] | null> {
    return this.fundamentalsApi.peers(symbol);
  }

  /**
   * Basic Financials - https://finnhub.io/docs/api/company-basic-financials
   * Get company basic financials such as margin, P/E ratio, 52-week high/low etc.
   * @param args @type {BasicFinancialsRequest}
   * @returns {BasicFinancials}
   */
  public async basicFinancials(
    args: BasicFinancialsRequest,
  ): Promise<BasicFinancials | null> {
    return this.fundamentalsApi.basicFinancials(args);
  }
}

export default FinnhubAPI;

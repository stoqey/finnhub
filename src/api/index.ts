import axios, { AxiosInstance } from "axios";
import {isEmpty} from 'lodash'
import { Candles, MarketDataItem, Resolution, TickData } from "../interface";
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
 */
export class FinnhubAPI {
  public token: string;

  public api: AxiosInstance;

  constructor(token: string) {
    this.api = axios.create({
      baseURL: "https://finnhub.io/api/v1",
    });
    this.token = token;
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
}

export default FinnhubAPI;

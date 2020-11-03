import csv from "csvtojson";
import moment from "moment";
import FinnhubAPI from ".";
import { TickData, QuoteResponse, Quote } from "../interface";

interface GetQuote {
  symbol: string;
  context: FinnhubAPI;
}

/**
 * Get quote
 * https://finnhub.io/docs/api#quote
 * @param args 
 */
export const getQuoteData = async (args: GetQuote): Promise<Quote> => {
  const { symbol = "AAPL", context } = args;

  const token = context.token;

  // https://finnhub.io/api/v1/quote?symbol=AAPL&token=
  const params = {
    symbol,
    token,
  };

  try {
    const ticks = await context.api.get(`quote`, {
      method: "GET",
      params,
    });

    const { c: close, h: high, l: low, o: open, pc: prevClose, t: time }: QuoteResponse = ticks.data;

    return {
      symbol,
      close,
      high,
      low,
      open,
      prevClose,
      date: new Date(+time * 1000),
    };
  } catch (error) {
    console.log("error getting quote", error && error.message);
    return {
      symbol,
      close: 0,
      high: 0,
      low: 0,
      open: 0,
      prevClose: 0,
      date: new Date(),
    };
  }
};

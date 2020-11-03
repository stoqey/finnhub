import csv from "csvtojson";
import moment from "moment";
import FinnhubAPI from ".";
import { TickData } from "../interface";

interface GetTickData {
  date: Date;
  symbol: string;
  context: FinnhubAPI;
}

export const getTickData = async (args: GetTickData): Promise<TickData[]> => {
  const { date: day = new Date(), symbol = "AAPL", context } = args;

  const token = context.token;
  const date = moment(day).format("YYYY-MM-DD");

  // https://finnhub.io/api/v1/stock/tick?symbol=AAPL&date=2020-03-25&token=
  const params = {
    symbol,
    token,
    date,
  };

  try {
    const ticks = await context.api.get(`stock/tick`, {
      method: "GET",
      params,
    });

    const data: string = ticks.data;

    // tslint:disable-next-line
    const jsonData = await csv().fromString(data);

    const formatedData: TickData[] = jsonData.map((jsD) => {
      return {
        date: new Date(+jsD.timestamp),
        price: Math.abs(jsD.price),
        volume: Math.abs(jsD.volume),
      };
    });

    return formatedData;
  } catch (error) {
    console.log("error getting candles", error && error.message);
    return [];
  }
};

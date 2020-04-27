import axios, { AxiosInstance } from 'axios';
import moment from 'moment';
import { MarketDataItem, Candles, Resolution } from './interface';
import FinnhubAPI from '.';


interface GetTickData {
    date: Date;
    symbol: string;
    context: FinnhubAPI;
};

export const getTickData = async (args: GetTickData) => {
    const { date: day = new Date(), symbol = "AAPL", context } = args;

    const token = context.token;
    const date = moment(day).format('YYYY-MM-DD');

    // https://finnhub.io/api/v1/stock/tick?symbol=AAPL&date=2020-03-25&token=
    const params = {
        symbol,
        token,
        date,
    };

    try {

        const ticks = await context.api.get(`stock/tick`, {
            method: 'GET',
            params
        });

        const data: Candles = ticks.data;

        console.log('data', typeof data);

    }
    catch (error) {
        console.log('error getting candles', error && error.message);
        return [];
    }

}
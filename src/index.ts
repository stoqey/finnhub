import axios, { AxiosInstance } from 'axios';
import { MarketDataItem, Candles, Resolution } from './interface';
import { getTickData } from './tick';
export * from './interface';

const round = (num: number) => Math.round(num);

/**
 * FinnhubAPI wrapper
 * - Get market data
 */
class FinnhubAPI {

    public token: string;

    public api: AxiosInstance;

    constructor(token: string) {
        this.api = axios.create({
            baseURL: 'https://finnhub.io/api/v1'
        });
        this.token = token;
    }

    /**
     * getCandles
     */
    public async getCandles(symbol: string, start: Date, end: Date, resolution: Resolution): Promise<MarketDataItem[]> {

        const token = this.token;
        const to = end.getTime() / 1000;
        const from = start.getTime() / 1000;

        //  const url = `https://finnhub.io/api/v1/stock/candle?symbol=${symbol}&resolution=${range}&from=${from}&to=${to}&token=${FINNHUB_KEY}`
        const params = {
            to: round(to),
            from: round(from),
            symbol,
            token,
            resolution
        };

        if (isNaN(from) || isNaN(to)) {
            console.log('error with parameters', { from, to })
            return [];
        }

        try {

            // TODO check lastime we pulled this symbol, else fetch it's data again
            const candles = await this.api.get(`stock/candle`, {
                method: 'GET',
                params
            });

            const data: Candles = candles.data;

            const marketData = !(data && data.c || []).length ? [] : data.c.map((cc, index) => {
                const close = cc; // a.k.
                const open = data.o[index];
                const time = data.t[index];
                const volume = data.v[index];
                const high = data.h[index];
                const low = data.l[index];
                return {
                    close,
                    time: new Date(+time * 1000),
                    volume,
                    open,
                    high,
                    low
                }
            });

            return marketData;
        }
        catch (error) {
            console.log('error getting candles', error && error.message);
            return [];
        }
    }

    /**
     * getTick
     */
    public getTick(symbol: string, date: Date) {
        return getTickData({ symbol, date, context: this });
    }
}

export default FinnhubAPI;
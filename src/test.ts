import 'mocha';
import { expect } from 'chai';
import FinnhubAPI from '.';

import dotenv from 'dotenv';
dotenv.config();

const finnHubKey = process && process.env.FINNHUB_KEY || "";

console.log('finnHubKey', finnHubKey);

const finnhubAPI = new FinnhubAPI(finnHubKey)

const symbol = 'AAPL';

const startDATE = new Date();
const startDate = new Date(startDATE.setDate(startDATE.getDate() - 4));
const endDate = new Date();

describe('Given FinnhubIO', () => {
    it('should get candles in the passed 4 days for ' + symbol, async () => {
        const candles = await finnhubAPI.getCandles(symbol, startDate, endDate, '1');
        console.log('candles', candles && candles[0]);
        console.log('candles length', candles && candles.length);
        expect(candles).not.to.be.empty;
    })
})
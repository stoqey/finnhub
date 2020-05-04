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

describe('FinnhubAPI', () => {

    it('should get candles in the passed 4 days for ' + symbol, async () => {
        const candles = await finnhubAPI.getCandles(symbol, startDate, endDate, '1');
        console.log('candles', candles && candles[candles.length - 1]);
        console.log('candles length', candles && candles.length);
        expect(candles).not.to.be.empty;
    })

    it('should timeout after 4 secs' + symbol, async () => {
        const startDate = new Date('2020-03-28T04:00:00.000Z');
        const endDate = new Date('2020-03-30T04:00:00.000Z');
        const candles = await finnhubAPI.getCandles(symbol, startDate, endDate, '1');
        console.log('candles', candles);
        console.log('candles length', candles && candles.length);
        expect(candles).not.to.be.empty;
    })

    it('should get ticks for a symbol' + symbol, async () => {
        const ticks = await finnhubAPI.getTick(symbol, startDate);
        console.log('ticks', ticks && ticks[ticks.length - 1]);
        console.log('ticks length', ticks && ticks.length);
        return expect(ticks.length).not.equals(0);
    })

})
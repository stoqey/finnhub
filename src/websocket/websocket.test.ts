import 'mocha';
import FinnhubWS from '.';

import dotenv from 'dotenv';
import { TickData } from '../interface';
dotenv.config();

const finnHubKey = process && process.env.FINNHUB_KEY || "";

console.log('finnHubKey', finnHubKey);

const finnhubWs = FinnhubWS.Instance;

before((done) => {
    finnhubWs.when("onReady", async () => {
        console.log('WS is ready');
        done();
    });
})

describe('FinnhubWS', () => {

    it('should get onData', (done) => {

        finnhubWs.when("onData", async (data: TickData) => {
            console.log('WS onData', data);
            done();
        });

        finnhubWs.addSymbol("TEST");

    })
})
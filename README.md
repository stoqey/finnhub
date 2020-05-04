# Finnhub - NodeJS Wrapper

#### Features

- Candles
- Tick
- Real-time price updates

### Install
```
npm i @stoqey/finnhub
```

### Initialize
Set env variable `FINNHUB_KEY` with the token you get from Finnhub.

```ts
import FinnhubAPI, { FinnhubWS } from '@stoqey/finnhub';

// For API
const finnhubAPI = new FinnhubAPI(finnHubKey);

// For Websockets
const finnhubWs = FinnhubWS.Instance;
```

### Get Candles
```ts
const candles = await finnhubAPI.getCandles(symbol, startDate, endDate, '1');
```

### Get Ticks
```ts
const ticks = await finnhubAPI.getTick(symbol, date);
```

### Real-time price updates
```ts
finnhubWs.when("onReady", async () => {
        console.log('WS is ready');
});

finnhubWs.when("onData", async (data: TickData) => {
        console.log('WS onData', data);
});

// Add symbol to streaming list
finnhubWs.addSymbol("AAPL");

// Stop streaming symbol
finnhubWs.removeSymbol("AAPL");

```

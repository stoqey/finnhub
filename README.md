# Finnhub - NodeJS Wrapper

#### Features

- Candles
- Tick
- Quote
- Real-time price updates

### Install
```
npm i @stoqey/finnhub
```

### Initialize
Set env variable `FINNHUB_KEY` with the token you get from Finnhub.

or simply assign it from the constructors 

```ts
import FinnhubAPI, { FinnhubWS } from '@stoqey/finnhub';

// For API
const finnhubAPI = new FinnhubAPI(finnHubKey);

// For Websockets
const finnhubWs = new FinnhubWS(finnHubKey); // or leave finnHubKey blank if process.env.FINNHUB_KEY is set
```

### Get Candles
```ts
const candles = await finnhubAPI.getCandles(symbol, startDate, endDate, '1');
```

### Get Ticks
```ts
const ticks = await finnhubAPI.getTick(symbol, date);
```

### Get Quote
```ts
const quote = await finnhubAPI.getQuote(symbol);
```

### Real-time price updates
```ts
finnhubWs.on("onReady", async () => {
        console.log('WS is ready');
});

finnhubWs.on("onData", async (data: TickData) => {
        console.log('WS onData', data);
});

// Add symbol to streaming list
finnhubWs.addSymbol("AAPL");

// Stop streaming symbol
finnhubWs.removeSymbol("AAPL");

```


## 
Set `process.env.DEBUG = "finnhub*"` to see all logs

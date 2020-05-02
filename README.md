# Finnhub - NodeJS Wrapper

### Features

- GET CANDLES
- GET TICK

### Install
```
npm i @stoqey/finnhub
```

### Initialize
```ts
import FinnhubAPI from '@stokey/finnhub';

const finnhubAPI = new FinnhubAPI(finnHubKey);
```

### Get Candles
```ts
const candles = await finnhubAPI.getCandles(symbol, startDate, endDate, '1');
```

### Get Ticks
```ts
const ticks = await finnhubAPI.getTick(symbol, date);
```

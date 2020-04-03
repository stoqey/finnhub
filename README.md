# Finnhub - NodeJS Wrapper

### Features

- GET CANDLES

```
npm i @stoqey/finnhub
```

```ts
import FinnhubAPI from '@stokey/finnhub';

 const finnhubAPI = new FinnhubAPI(finnHubKey);

 const candles = await finnhubAPI.getCandles(symbol, startDate, endDate, '1');
```

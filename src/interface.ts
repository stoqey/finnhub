export type Resolution = "1" | "5" | "15" | "30" | "60" | "D" | "W" | "M";

export interface TickData {
  symbol: string;
  date: Date;
  close: number;
  volume?: number;
}

export interface MarketDataItem {
  close: number;
  date: Date;
  high: number;
  low: number;
  open: number;
  volume: number;
}

export interface Candles {
  c: number[];
  h: number[];
  l: number[];
  o: number[];
  s: string;
  t: number[];
  v: number[];
}

export interface QuoteResponse {
  c: number;
  h: number;
  l: number;
  o: number;
  pc: number;
  t: number;
}

export interface Quote {
  symbol: string;
  close: number; // Current price
  high: number; // Low price of the day
  low: number; // High price of the day
  open: number; // Open price of the day
  prevClose: number; // Previous close price
  date: Date; // time
}

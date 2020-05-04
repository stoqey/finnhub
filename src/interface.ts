export type Resolution = "1" | "5" | "15" | "30" | "60" | "D" | "W" | "M";

export interface TickData {
  symbol?: string;
  date: Date;
  price: number;
  volume: number;
}

export interface MarketDataItem {
  close: number;
  date: Date;
  high: number;
  low: number;
  open: number;
  volume: number;
};

export interface Candles {
  c: number[];
  h: number[];
  l: number[];
  o: number[];
  s: string;
  t: number[];
  v: number[];
}


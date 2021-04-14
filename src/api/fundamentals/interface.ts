export interface SymbolData {
  description: string;
  displaySymbol: string;
  symbol: string;
  type: string;
}

export interface SymbolLookup {
  count: number;
  result: SymbolData[];
}

export interface CompanyProfile2Request {
  symbol?: string;
  isin?: string;
  cusip?: string;
}

export interface CompanyProfile2 {
  country: string;
  currency: string;
  exchange: string;
  ipo: Date;
  marketCapitalization: number;
  name: string;
  phone: string;
  shareOutstanding: number;
  ticker: string;
  weburl: string;
  logo: string;
  finnhubIndustry: string;
}

export type MarketCategory = "general" | "forex" | "crypto" | "merger";

export interface MarketNewsRequest {
  category: MarketCategory;
  minId?: number;
}

export interface MarketNews {
  category: string;
  datetime: Date;
  headline: string;
  id: number;
  image: string;
  related: string;
  source: string;
  summary: string;
  url: string;
}

export interface CompanyNewsRequest {
  symbol: string;
  from: Date;
  to: Date;
}

export interface CompanyNews extends MarketNews {}

export interface Buzz {
  articlesInLastWeek: number;
  buzz: number;
  weeklyAverage: number;
}

export interface Sentiment {
  bearishPercent: number;
  bullishPercent: number;
}

export interface NewsSentiment {
  buzz: Buzz;
  companyNewsScore: number;
  sectorAverageBullishPercent: number;
  sectorAverageNewsScore: number;
  sentiment: Sentiment;
  symbol: string;
}

export type MetricType = "all";

export interface BasicFinancialsRequest {
  symbol: string;
  metric: MetricType;
}

export interface TimeRatios {
  period: Date;
  v: number;
}

export interface BasicFinancials {
  symbol: string;
  metricType: string;
  series: Map<string, TimeRatios[]>;
  metric: Map<string, number>;
}

export interface InsiderTransactionRequest {
  symbol: string;
  from?: Date;
  to?: Date;
}

export interface InsiderTransactionData {
  name: string;
  share: number;
  change: number;
  filingDate: Date;
  transactionDate: Date;
  transactionPrice: number;
  transactionCode: string;
}

export interface InsiderTransaction {
  symbol: string;
  data: InsiderTransactionData[];
}

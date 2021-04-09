interface SymbolData {
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

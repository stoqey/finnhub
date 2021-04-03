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

export interface CompanyProfile {
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

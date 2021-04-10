import FinnhubAPI from "../";
import {
  CompanyNews,
  CompanyNewsRequest,
  CompanyProfile2,
  CompanyProfile2Request,
  MarketNews,
  MarketNewsRequest,
  SymbolLookup,
} from "./interface";

class Fundamentals {
  public ctx: FinnhubAPI;

  constructor(context: FinnhubAPI) {
    this.ctx = context;
  }

  /**
   * Symbol Lookup - https://finnhub.io/docs/api/symbol-search
   * Search for best-matching symbols based on your query. You can input anything from symbol, security's name to ISIN and Cusip.
   * @param query Query text can be symbol, name, isin, or cusip.
   * @returns {SymbolLookup}
   */
  public symbolLookup = async (query?: string): Promise<SymbolLookup> => {
    const token = this.ctx.token;
    const params = {
      q: query,
      token,
    };

    try {
      const symbolLookupResponse = await this.ctx.api.get("search", {
        method: "GET",
        params,
      });

      const symbolLookup: SymbolLookup = symbolLookupResponse.data;
      return symbolLookup;
    } catch (error) {
      console.log("error symbol lookup", error && error.message);
      return {
        count: 0,
        result: [],
      };
    }
  };

  /**
   * Company Profile 2 - https://finnhub.io/docs/api/company-profile2
   * Get general information of a company. You can query by symbol, ISIN or CUSIP. This is the free version of Company Profile.
   * @param args @type {CompanyProfile2Request}
   * @returns {CompanyProfile2}
   */
  public companyProfile2 = async (
    args: CompanyProfile2Request,
  ): Promise<CompanyProfile2> => {
    const token = this.ctx.token;

    // https://finnhub.io/api/v1/stock/profile2?symbol=AAPL&token=
    const params = {
      symbol: args.symbol,
      isin: args.isin,
      cusip: args.cusip,
      token,
    };

    try {
      const profile = await this.ctx.api.get(`stock/profile2`, {
        method: "GET",
        params,
      });

      const profileData: CompanyProfile2 = profile.data;

      return profileData;
    } catch (error) {
      console.log("error getting company profile", error && error.message);
      return {
        country: "",
        currency: "",
        exchange: "",
        ipo: new Date(),
        marketCapitalization: 0,
        name: "",
        phone: "",
        shareOutstanding: 0,
        ticker: "",
        weburl: "",
        logo: "",
        finnhubIndustry: "",
      };
    }
  };

  /**
   * Market News - https://finnhub.io/docs/api/market-news
   * Get latest market news.
   * @param args @type {MarketNewsRequest}
   * @returns {MarketNews}
   */
  public marketNews = async (
    args: MarketNewsRequest,
  ): Promise<MarketNews[]> => {
    const token = this.ctx.token;

    // https://finnhub.io/api/v1/news?category=general&token=
    const params = {
      category: args.category,
      minId: args.minId,
      token,
    };

    try {
      const marketNewsRes = await this.ctx.api.get(`news`, {
        method: "GET",
        params,
      });

      const marketNews: MarketNews[] = marketNewsRes.data;
      return marketNews;
    } catch (error) {
      console.log("error getting market news", error && error.message);
      return [];
    }
  };

  /**
   * Company News - https://finnhub.io/docs/api/company-news
   * List latest company news by symbol. This endpoint is only available for North American companies.
   * @param args @type {CompanyNewsRequest}
   * @returns {CompanyNews}
   */
  public companyNews = async (
    args: CompanyNewsRequest,
  ): Promise<CompanyNews[]> => {
    const token = this.ctx.token;

    // https://finnhub.io/api/v1/company-news?symbol=AAPL&from=2021-03-01&to=2021-03-09&token=
    const params = {
      symbol: args.symbol,
      from: args.from.toISOString().split("T")[0],
      to: args.to.toISOString().split("T")[0],
      token,
    };

    try {
      const companyNewsRes = await this.ctx.api.get(`company-news`, {
        method: "GET",
        params,
      });

      const companyNews: CompanyNews[] = companyNewsRes.data;
      return companyNews;
    } catch (error) {
      console.log("error getting market news", error && error.message);
      return [];
    }
  };
}

export default Fundamentals;

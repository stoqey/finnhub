import FinnhubAPI from "../";
import {
  BasicFinancials,
  BasicFinancialsRequest,
  CompanyNews,
  CompanyNewsRequest,
  CompanyProfile2,
  CompanyProfile2Request,
  InsiderTransaction,
  InsiderTransactionRequest,
  MarketNews,
  MarketNewsRequest,
  NewsSentiment,
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
   * @returns {SymbolLookup | null}
   */
  public symbolLookup = async (
    query?: string,
  ): Promise<SymbolLookup | null> => {
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
      return null;
    }
  };

  /**
   * Company Profile 2 - https://finnhub.io/docs/api/company-profile2
   * Get general information of a company. You can query by symbol, ISIN or CUSIP. This is the free version of Company Profile.
   * @param args @type {CompanyProfile2Request}
   * @returns {CompanyProfile2 | null}
   */
  public companyProfile2 = async (
    args: CompanyProfile2Request,
  ): Promise<CompanyProfile2 | null> => {
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
      return null;
    }
  };

  /**
   * Market News - https://finnhub.io/docs/api/market-news
   * Get latest market news.
   * @param args @type {MarketNewsRequest}
   * @returns {MarketNews | null}
   */
  public marketNews = async (
    args: MarketNewsRequest,
  ): Promise<MarketNews[] | null> => {
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
      return null;
    }
  };

  /**
   * Company News - https://finnhub.io/docs/api/company-news
   * List latest company news by symbol. This endpoint is only available for North American companies.
   * @param args @type {CompanyNewsRequest}
   * @returns {CompanyNews | null}
   */
  public companyNews = async (
    args: CompanyNewsRequest,
  ): Promise<CompanyNews[] | null> => {
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
      return null;
    }
  };

  /**
   * News Sentiment - https://finnhub.io/docs/api/news-sentiment
   * Get company's news sentiment and statistics. This endpoint is only available for US companies.
   * @param symbol
   * @returns {NewsSentiment | null}
   */
  public newsSentiment = async (
    symbol: string,
  ): Promise<NewsSentiment | null> => {
    const token = this.ctx.token;

    // https://finnhub.io/api/v1/news-sentiment?symbol=V&token=
    const params = {
      symbol,
      token,
    };

    try {
      const newsSentimentRes = await this.ctx.api.get("news-sentiment", {
        method: "GET",
        params,
      });

      const newsSentiment = newsSentimentRes.data;
      return newsSentiment;
    } catch (error) {
      console.log("error getting news sentiment", error && error.message);
      return null;
    }
  };

  /**
   * Peers - https://finnhub.io/docs/api/company-peers
   * Get company peers. Return a list of peers in the same country and GICS sub-industry
   * @param symbol Symbol of the company
   * @returns Array of peers' symbol.
   */
  public peers = async (symbol: string): Promise<string[] | null> => {
    const token = this.ctx.token;

    // https://finnhub.io/api/v1/stock/peers?symbol=AAPL&token=
    const params = {
      symbol,
      token,
    };

    try {
      const peers: string[] = (
        await this.ctx.api.get(`stock/peers`, {
          method: "GET",
          params,
        })
      ).data;

      return peers;
    } catch (error) {
      console.log("error getting peers", error && error.message);
      return null;
    }
  };

  /**
   * Basic Financials - https://finnhub.io/docs/api/company-basic-financials
   * Get company basic financials such as margin, P/E ratio, 52-week high/low etc.
   * @param args @type {BasicFinancialsRequest}
   * @returns {BasicFinancials}
   */
  public basicFinancials = async (
    args: BasicFinancialsRequest,
  ): Promise<BasicFinancials | null> => {
    const token = this.ctx.token;

    const params = {
      symbol: args.symbol,
      metric: args.metric,
      token,
    };

    try {
      const basicFinancialsRes = await this.ctx.api.get("stock/metric", {
        method: "GET",
        params,
      });

      return basicFinancialsRes.data;
    } catch (error) {
      console.log("error getting basic financials", error && error.message);
      return null;
    }
  };

  /**
   * Insider Transactions - https://finnhub.io/docs/api/insider-transactions
   * Company insider transactions data sourced from Form 3,4,5. This endpoint only covers US companies at the moment.
   * Limit to 100 transactions per API call.
   * @param args @type {InsiderTransactionRequest}
   * @returns {InsiderTransaction}
   */
  public insiderTransactions = async (
    args: InsiderTransactionRequest,
  ): Promise<InsiderTransaction | null> => {
    const token = this.ctx.token;

    const params = {
      symbol: args.symbol,
      from: args.from,
      to: args.to,
      token,
    };

    try {
      const insiderTransactionRes = await this.ctx.api.get(
        "stock/insider-transactions",
        {
          method: "GET",
          params,
        },
      );

      return insiderTransactionRes.data;
    } catch (error) {
      console.log("error getting insider transactions", error && error.message);
      return null;
    }
  };
}

export default Fundamentals;

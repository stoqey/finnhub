import FinnhubAPI from "../";
import {
  CompanyProfile2,
  CompanyProfile2Request,
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
   * @returns SymbolLookup
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
   * Company Profile 2
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
      args,
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
}

export default Fundamentals;

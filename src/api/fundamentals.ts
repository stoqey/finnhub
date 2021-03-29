import FinnhubAPI from ".";
import { CompanyProfile } from "../interface";

interface GetProfile {
  symbol: string;
  context: FinnhubAPI;
}

/**
 * Get Company Profile2
 * https://finnhub.io/docs/api/company-profile
 * @param args
 */
export const getCompanyProfile2Data = async (
  args: GetProfile,
): Promise<CompanyProfile> => {
  const { symbol = "AAPL", context } = args;

  const token = context.token;

  // https://finnhub.io/api/v1/stock/profile2?symbol=AAPL&token=
  const params = {
    symbol,
    token,
  };

  try {
    const profile = await context.api.get(`stock/profile2`, {
      method: "GET",
      params,
    });

    const profileData: CompanyProfile = profile.data;

    return profileData;
  } catch (error) {
    console.log("error getting company profile", error && error.message);
    return {
      symbol,
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

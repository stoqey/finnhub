import FinnhubAPI from ".";
import { RecommendationTrends } from "../interface";

interface GetRecommendation {
  symbol: string;
  context: FinnhubAPI;
}

/**
 * Get Recommendation Trends
 * https://finnhub.io/docs/api/recommendation-trends
 * @param args
 */
export const GetRecommendationTrends = async (
  args: GetRecommendation,
): Promise<RecommendationTrends[]> => {
  const { symbol = "AAPL", context } = args;

  const token = context.token;

  // https://finnhub.io/api/v1/stock/recommendation?symbol=AAPL&token=
  const params = {
    symbol,
    token,
  };

  try {
    const recommendations = await context.api.get(`stock/recommendation`, {
      method: "GET",
      params,
    });

    const recommendationTrends: RecommendationTrends[] = recommendations.data;
    return recommendationTrends;
  } catch (error) {
    console.log("error getting recommendation trends", error && error.message);
    return [
      {
        symbol,
        buy: 0,
        hold: 0,
        period: new Date(),
        sell: 0,
        strongBuy: 0,
        strongSell: 0,
      },
    ];
  }
};

import FinnhubAPI from "./";

interface GetPeers {
  symbol: string;
  context: FinnhubAPI;
}

/**
 * Get peers
 * https://finnhub.io/docs/api/company-peers
 * @param args
 */
export const getPeers = async (args: GetPeers): Promise<string[]> => {
  const { symbol = "AAPL", context } = args;

  const token = context.token;

  // https://finnhub.io/api/v1/stock/peers?symbol=AAPL&token=
  const params = {
    symbol,
    token,
  };

  try {
    const peers: string[] = (
      await context.api.get(`stock/peers`, {
        method: "GET",
        params,
      })
    ).data;

    return peers;
  } catch (error) {
    console.log("error getting quote", error && error.message);
    return [];
  }
};

import "mocha";
import FinnhubWS, { FinnhubWSEvents } from ".";

import dotenv from "dotenv";
import { TickData } from "../interface";
dotenv.config();

const finnHubKey = (process && process.env.FINNHUB_KEY) || "";

console.log("finnHubKey", finnHubKey);

const finnhubWs = new FinnhubWS(finnHubKey);

before((done) => {
  finnhubWs.on(FinnhubWSEvents.onReady, async () => {
    console.log("WS is ready");
    done();
  });
});

describe("FinnhubWS", () => {
  it("should get onData", (done) => {
    let completed = false;
    finnhubWs.on("onData", async (data: TickData) => {
      console.log("WS onData", data);
      if (!completed) {
        done();
      }
      completed = true;
    });

    finnhubWs.addSymbol("AAPL");
  });

  it("should stop getting data get onData", (done) => {
    finnhubWs.on("onData", async (data: TickData) => {
      console.log("WS onData", data);
    });

    finnhubWs.removeSymbol("AAPL");

    setTimeout(() => {
      done();
    }, 10000);
  });
});

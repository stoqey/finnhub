import { EventEmitter } from "events";
import WebSocket from "ws";
import { FINNHUB_KEY, TZ_ON } from "../config";
import { TickData } from "../interface";
import { checkIfMarketIsOpen } from "../utils/checkIfMarketIsOpen";
import { log } from "../utils/log";
import JSONDATA from "../utils/text.utils";

/**
 * Finnhub websocket events
 */
export enum FinnhubWSEvents {
  /**
   * { symbol, date, close, volume? }
   */
  onData = "onData",

  /**
   * true / false
   */
  onReady = "onReady",

  /**
   * new Error()
   */
  onError = "onError",
}

/**
 * @Websocket
 * Stream real-time trades for US stocks, forex and crypto.
 * @see https://finnhub.io/docs/api#websocket-price
 */
export class FinnhubWS extends EventEmitter {
  private socket: WebSocket = null as any;

  private symbols: string[] = [];

  token: string = FINNHUB_KEY;

  constructor(token?: string) {
    super();
    if (token) {
      this.token = token;
    }
    this.config();
  }

  /**
   * config
   */
  public config() {
    const self = this;

    if (TZ_ON) {
      if (checkIfMarketIsOpen()) {
        return self.init();
      } else {
        log("Market is closed cannot subscribe to market data");
        // infinity loop
        return setTimeout(() => {
          log("FinnhubIO.config heartbeat");
          self.config();
        }, 5000);
      }
    }

    self.init();
  }

  /**
   * init
   */
  private init() {
    const self = this;

    const token = self.token;

    // Emulate for test
    if (process.env.NODE_ENV === "test") {
      setTimeout(async () => {
        self.emit(FinnhubWSEvents.onReady, true);
      }, 3000);
      return;
    }

    log("FinnhubIO.init startup", (token || "").slice(0, 5));

    this.socket = new WebSocket(`wss://ws.finnhub.io?token=${token}`);

    this.socket.on("open", () => {
      self.emit(FinnhubWSEvents.onReady, true);
    });

    this.socket.on("error", (error: Error) => {
      log("on error connecting socket", error);

      self.emit(FinnhubWSEvents.onError, error);
      // setTimeout(() => self.config(), 2000);
      return;
    });

    interface OnSocketData {
      data: { s: string; p: number; t: number; v: string }[];
      type: string;
    }

    this.socket.on("message", (data: OnSocketData): void => {
      // @ts-ignore
      const parsedData: OnSocketData = JSONDATA(data);

      if (!parsedData) {
        return;
      }

      if (parsedData && parsedData.data && parsedData.data[0]) {
        const priceItem = parsedData.data[0];
        const symbol = priceItem.s;

        const dataToSend: TickData = {
          close: priceItem.p,
          date: new Date(priceItem.t),
          symbol: priceItem.s,
          volume: +priceItem.v,
        };

        const topicSymbol = symbol;

        log(topicSymbol, dataToSend.close);

        self.emit(FinnhubWSEvents.onData, dataToSend);
      }
    });
  }

  /**
   * Add symbol
   * @param symbol: string
   * @returns boolean
   */
  public addSymbol(symbol: string): boolean {
    log("addSymbol", symbol);

    const self = this;

    // If test
    if (symbol === "TEST") {
      setTimeout(() => {
        const dataToSend: TickData = {
          close: 1000,
          date: new Date(),
          symbol: "STQ",
          volume: 0,
        };

        self.emit(FinnhubWSEvents.onData, dataToSend);
      }, 2000);
      return true;
    }

    if (!this.socket) {
      return false;
    }

    try {
      const isExist = this.symbols.includes(symbol);

      if (isExist) {
        return false;
      }

      // Add symbol
      // Request market data for this symbol
      this.symbols.push(symbol);
      this.socket.send(JSON.stringify({ type: "subscribe", symbol }));
      log("Added symbol", symbol);
      return true;
    } catch (error) {
      log("AddSybols ", error);
      return false;
    }
  }

  /**
   * Removes symbol from subscription list
   * @param symbol
   */
  public removeSymbol(symbol: string): boolean {
    try {
      const isExist = this.symbols.includes(symbol);
      if (isExist) {
        // Request unsubscribe market data for this symbol
        this.symbols = this.symbols.filter((item) => item !== symbol);
        this.socket.send(JSON.stringify({ type: "unsubscribe", symbol }));

        log("new symbols are -------------------------->", this.symbols);
        return true;
      }
      return false;
    } catch (error) {
      log("Error removing symbol", error);
      return false;
    }
  }
}

export default FinnhubWS;

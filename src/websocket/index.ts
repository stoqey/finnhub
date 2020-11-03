import WebSocket from "ws";
import { checkIfMarketIsOpen } from "../utils/checkIfMarketIsOpen";
import { log } from "../utils/log";
import { isDev, FINNHUB_KEY, TZ_ON } from "../config";
import JSONDATA from "../utils/text.utils";
import { TickData } from "src/interface";

interface PublisherEvents {
  /**
   * Called when WS is ready
   */
  onReady: () => Promise<any>;

  onData: (data: TickData) => Promise<any>;

  error: (error: Error) => Promise<any>;
}

/**
 * @Websocket
 * Stream real-time trades for US stocks, forex and crypto.
 * @see https://finnhub.io/docs/api#websocket-price
 */
export class FinnhubWS {
  private static _instance: FinnhubWS;

  private socket: WebSocket = null as any;

  private symbols: string[] = [];

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }

  events: PublisherEvents = {} as any;

  /**
   * @template
   * when/on
   */
  public when(
    event: keyof PublisherEvents,
    func: (data?: any) => Promise<any>
  ): void {
    this.events[event] = func;
  }

  private constructor() {
    this.config();
  }

  /**
   * config
   */
  public config() {
    let self = this;

    if (TZ_ON) {
      if (checkIfMarketIsOpen()) {
        return self.init();
      } else {
        console.log("Market is closed cannot subscribe to market data");
        // infinity loop
        return setTimeout(() => {
          console.log("FinnhubIO.config heartbeat");
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
    let self = this;

    // Emulate for test
    // if (process.env.NODE_ENV === 'test') {
    //     setTimeout(async () => {

    //         // Emit ready
    //         const onReady = self.events["onReady"];

    //         if (onReady) {
    //             await onReady();
    //         }

    //     }, 3000);

    //     return;
    // }

    console.log("FinnhubIO.init startup", (FINNHUB_KEY || "").slice(0, 5));

    this.socket = new WebSocket(`wss://ws.finnhub.io?token=${FINNHUB_KEY}`);

    this.socket.on("open", function open(this: any) {
      const onReady = self.events.onReady;
      if (onReady) {
        onReady();
      }
    });

    this.socket.on("error", (error: any) => {
      console.log("on error connecting socket", error);

      const onError = self.events.error;
      if (onError) {
        onError(error);
      }

      setTimeout(() => self.config(), 2000);
      return;
    });

    interface OnSocketData {
      data: [{ s: string; p: number; t: number; v: string }];
      type: string;
    }

    this.socket.on("message", async function (
      data: OnSocketData
    ): Promise<void> {
      // @ts-ignore
      const parsedData: OnSocketData = JSONDATA(data);

      if (!parsedData) {
        return;
      }

      if (parsedData && parsedData.data && parsedData.data[0]) {
        const priceItem = parsedData.data[0];
        const symbol = priceItem.s;

        const dataToSend: TickData = {
          price: priceItem.p,
          date: new Date(priceItem.t),
          symbol: priceItem.s,
          volume: +priceItem.v,
        };

        const topicSymbol = symbol;

        log(topicSymbol, dataToSend.price);

        // If we have a publisher then send to it
        const onData = self.events.onData;
        if (onData) {
          await onData(dataToSend);
        }
      }
    });
  }

  /**
   * Add symbol
   * @param symbol: string
   * @returns boolean
   */
  public addSymbol(symbol: string): boolean {
            console.log("addSymbol", symbol);

    const onData = this.events.onData;

    // If test
    if (symbol === "TEST") {
      setTimeout(() => {
        if (onData) {
          const dataToSend: TickData = {
            price: 1000,
            date: new Date(),
            symbol: "STQ",
            volume: 0,
          };
          onData(dataToSend);
        }
      }, 2000);
      return true;
    }

    if (!this.socket) {
      return false;
    }

    try {
      const isExist = this.symbols.find((x) => x === symbol);

      if (isExist) {
        return false;
      }

      // Add symbol
      // Request market data for this symbol
      this.symbols.push(symbol);
      this.socket.send(JSON.stringify({ type: "subscribe", symbol }));
      console.log("Added symbol", symbol);
      return true;
    } catch (error) {
      console.log("AddSybols ", error);
      return false;
    }
  }

  /**
   * Removes symbol from subscription list
   * @param symbol
   */
  public removeSymbol(symbol: String): Boolean {
    try {
      const isExist = this.symbols.findIndex((x) => x === symbol);
      if (isExist) {
        // Remove symbol
        // Request unsubscribe market data for this symbol
        this.symbols = this.symbols.filter((item) => item !== symbol);
        this.socket.send(JSON.stringify({ type: "unsubscribe", symbol }));
        return true;
      }
      return false;
    } catch (error) {
      console.log("Error removing symbol", error);
      return false;
    }
  }
}

export default FinnhubWS;

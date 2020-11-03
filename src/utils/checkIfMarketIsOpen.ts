import moment from "moment";
import "moment-business-time";

const workingTime = ["09:00:00", "17:00:00"];

export const checkIfMarketIsOpen = (): boolean => {
  const date = new Date();
  // set opening time to 09:00 and close early on Wednesdays
  // close for a one hour lunch break on Thursdays
  moment.updateLocale("en", {
    workinghours: {
      0: null,
      1: workingTime,
      2: workingTime,
      3: workingTime,
      4: workingTime,
      5: workingTime,
      6: null,
    },
  });

  return moment(date).utcOffset("-05:00").isWorkingTime();
};

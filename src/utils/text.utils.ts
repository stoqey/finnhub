import { isEmpty } from "lodash";

export const JSONDATA = (data: any): Record<string, any> | string | null => {
  if (isEmpty(data) || !data) {
    return null;
  }

  try {
    if (typeof data !== "object") {
      return JSON.parse(data);
    }
    return data;
  } catch (error) {
    // console.log('error trying to parse response data');
    return data;
  }
};

export default JSONDATA;

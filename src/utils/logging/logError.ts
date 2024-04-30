import { appendFile } from "fs";
import { throwFormattedErrorLog } from "./errorFormats";

const logError = (error: unknown) => {
  const UTC_DATE = new Date().toUTCString();
  try {
    appendFile("logs/err_logs.txt", `[${UTC_DATE}] \n ${error} \n \n`, (err) => {
      if (err) throw err;
    });
  } catch (err) {
    console.log("Error logging failed");
  }
};

export const logFormattedError = (error: unknown) => {
  const UTC_DATE = new Date().toUTCString();
  try {
    appendFile(
      "logs/err_logs.txt",
      `[${UTC_DATE}] \n ${throwFormattedErrorLog(error)} \n \n`,
      (err) => {
        if (err) throw err;
      },
    );
  } catch (err) {
    console.log("Error logging failed");
  }
};

export default logError;

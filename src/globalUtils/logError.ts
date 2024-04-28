import { appendFile } from "fs";

const logError = (error: any) => {
  const UTC_DATE = new Date().toUTCString();
  try {
    appendFile("logs/err_logs.txt", `[${UTC_DATE}] \n ${error} \n \n`, (err) => {
      if (err) throw err;
    });
  } catch (err) {
    console.log("Error logging failed");
  }
};

export default logError;

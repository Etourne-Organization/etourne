import { appendFile } from "fs";

interface logFile {
  error: any;
  file: string;
  folder: string;
}

const logFile = (props: logFile) => {
  const { error, file, folder } = props;

  try {
    appendFile("logs/err_logs.txt", `[${new Date().toUTCString()}] \n ${error} \n \n`, (err) => {
      if (err) throw err;
    });

    return false;
  } catch (err) {
    console.log("Error logging failed");
  }
};

export default logFile;

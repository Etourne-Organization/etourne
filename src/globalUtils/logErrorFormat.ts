function stringifyError(error: any): string {
  let errorStr: string = "";

  if (Array.isArray(error)) {
    errorStr = error.map((err) => stringifyError(err)).join("\\n");
  } else if (typeof error === "string") {
    errorStr = error;
  } else if (error?.response?.data) {
    errorStr = JSON.stringify(error.response.data);
  } else if (error?.message || error instanceof Error) {
    errorStr = `${error.message}`;
  } else {
    errorStr = JSON.stringify(error);
  }

  return errorStr;
}

export function throwFormattedErrorLog(error: any): string {
  const err = new Error(stringifyError(error)).stack;
  const splitErrors = err?.split("\n");

  // ? get first, third, and last lines (these are relevant ones)
  if (splitErrors && splitErrors?.length > 1) {
    const [firstLine, thirdLine, lastLine] = [splitErrors[0], splitErrors[2], splitErrors[splitErrors.length - 1]];
    throw `${firstLine}\n${thirdLine}\n${lastLine}`;
  } else {
    throw err;
  }
}

export function throwCompleteErrorLog(error: any): string {
  const err = new Error(stringifyError(error)).stack;

  throw err;
}

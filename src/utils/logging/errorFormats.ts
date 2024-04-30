// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

function generateCustomError(error: unknown) {
  return (error instanceof Error ? error.stack : new Error(stringifyError(error)).stack) || "";
}

export function throwFormattedErrorLog(error: unknown): string {
  // ? Convert error to a string or stack trace, defaulting to an empty string if undefined
  const err = generateCustomError(error);
  const splitErrors = err
    .split("\n")
    .filter(
      (f) =>
        !f.includes("at processTicksAndRejections") && !f.includes("at throwFormattedErrorLog"),
    );

  return splitErrors.join("\n");
}

export function throwCompleteErrorLog(error: unknown): string {
  const err = generateCustomError(error)

  return err;
}

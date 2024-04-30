/* eslint-disable @typescript-eslint/no-explicit-any */
import logError, { logFormattedError } from "./logError";
import { throwCompleteErrorLog } from "./errorFormats";

export async function handleAsyncError(
  err: unknown,
  callback?: () => Promise<any>,
): Promise<any> {
  try {
    if (callback) await callback();
  } catch (followUpErr) {
    logError(throwCompleteErrorLog(followUpErr));
  }

  logFormattedError(err);
}

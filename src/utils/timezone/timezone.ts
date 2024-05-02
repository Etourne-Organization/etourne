import moment from "moment-timezone";

// Define the time format to use for hours, minutes, and seconds.
export const isoTimeFormat = "HH:mm:ss";

// Define the date format to be used for parsing dates from user input.
export const isoParsingDateFormat = "DD/MM/YYYY";

// const isoFormattingDateFormat = "YYYY-MM-DD";

// Regular expression to match GMT time zones in the format "Etc/GMT[+/-]X" where X is the hour offset.
const gmtZoneRegex = /^Etc\/(GMT([+-]\d+)?)$/;

// const momentToTimeInputValue = (
//   time: Moment = moment(),
//   format = `${isoFormattingDateFormat}\\T${isoTimeFormat}`,
// ): string =>
//   // Force English locale so values are always in the expected format
//   time.clone().locale("en").format(format);

// Function to format a GMT time zone label with the given offset.
const formatGmtZoneLabel = (offset = "") => `GMT${offset} (UTC${offset})`;

// Function to transform a GMT time zone name to a more user-friendly format.
const transformGmtZoneName = (value: string): string =>
  value.replace(gmtZoneRegex, (_, extractedIdentifier: string) =>
    // eslint-disable-next-line @typescript-eslint/naming-convention
    extractedIdentifier.replace(/^GMT(?:(\[+-\])(\\d+))?$/, (__, sign: string, offset: string) => {
      const newSign = sign ? (sign === "+" ? "-" : "+") : "";
      return formatGmtZoneLabel(`${newSign}${offset ?? ""}`);
    }),
  );

// Function to compare two GMT time zone strings by their offset values.
const compareGmtStrings = (a: string, b: string) =>
  parseInt(a.replace(gmtZoneRegex, "$2"), 10) - parseInt(b.replace(gmtZoneRegex, "$2"), 10);

// Function to get the timezone label, either the original name or a formatted GMT label.
const getTimezoneLabel = (timezone: string): string => {
  if (!gmtZoneRegex.test(timezone)) return timezone;
  return transformGmtZoneName(timezone);
};

// Function to get an object with the timezone value and label.
const getTimezoneValue = (timezone: string) => ({
  value: timezone,
  label: getTimezoneLabel(timezone),
});

/* Get a sorted array of normalized timezone names, excluding some special cases */
export const getSortedNormalizedTimezoneNames = (): string[] =>
  moment.tz
    .names()
    .filter((name) => !/^(?:Etc\/)?GMT\[+-\]?0$/.test(name) && name !== "GMT")
    .sort((a, b) => {
      const isAGmt = gmtZoneRegex.test(a);
      const isBGmt = gmtZoneRegex.test(b);
      if (isAGmt) return isBGmt ? compareGmtStrings(a, b) : -1;
      if (isBGmt) return isAGmt ? compareGmtStrings(a, b) : 1;
      return a.localeCompare(b);
    });

/* Get the timezone value from a given label */
export const getTimezoneValueFromLabel = (label: string) => {
  // Maps timezone labels with values by creating an object
  const tzs = getSortedNormalizedTimezoneNames().map((tz) => getTimezoneValue(tz));
  return tzs.filter((tz) => tz.label === label.trim())[0]["value"];
};

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.momentToTimeInputValue = exports.getTimezoneValue = exports.getTimezoneLabel = exports.getSortedNormalizedTimezoneNames = exports.transformGmtZoneName = exports.getTimzeonValueFromLabel = exports.gmtZoneRegex = exports.isoParsingDateFormat = exports.isoFormattingDateFormat = exports.isoTimeFormat = void 0;
const tslib_1 = require("tslib");
const moment_timezone_1 = tslib_1.__importDefault(require("moment-timezone"));
exports.isoTimeFormat = 'HH:mm:ss';
exports.isoFormattingDateFormat = 'YYYY-MM-DD';
exports.isoParsingDateFormat = 'DD/MM/YYYY';
exports.gmtZoneRegex = /^Etc\/(GMT([+-]\d+)?)$/;
const getTimzeonValueFromLabel = (label) => {
    const tzs = (0, exports.getSortedNormalizedTimezoneNames)().map((tz) => (0, exports.getTimezoneValue)(tz));
    return tzs.filter((tz) => tz.label === label.trim())[0]['value'];
};
exports.getTimzeonValueFromLabel = getTimzeonValueFromLabel;
const formatGmtZoneLabel = (offset = '') => `GMT${offset} (UTC${offset})`;
const transformGmtZoneName = (value) => value.replace(exports.gmtZoneRegex, (_, extractedIdentifier) => extractedIdentifier.replace(/^GMT(?:([+-])(\d+))?$/, (__, sign, offset) => {
    const newSign = sign ? (sign === '+' ? '-' : '+') : '';
    return formatGmtZoneLabel(`${newSign}${offset ?? ''}`);
}));
exports.transformGmtZoneName = transformGmtZoneName;
const compareGmtStrings = (a, b) => parseInt(a.replace(exports.gmtZoneRegex, '$2'), 10) -
    parseInt(b.replace(exports.gmtZoneRegex, '$2'), 10);
const getSortedNormalizedTimezoneNames = () => moment_timezone_1.default.tz
    .names()
    .filter((name) => !/^(?:Etc\/)?GMT[+-]?0$/.test(name) && name !== 'GMT')
    .sort((a, b) => {
    const isAGmt = exports.gmtZoneRegex.test(a);
    const isBGmt = exports.gmtZoneRegex.test(b);
    if (isAGmt)
        return isBGmt ? compareGmtStrings(a, b) : -1;
    if (isBGmt)
        return isAGmt ? compareGmtStrings(a, b) : 1;
    return a.localeCompare(b);
});
exports.getSortedNormalizedTimezoneNames = getSortedNormalizedTimezoneNames;
const getTimezoneLabel = (timezone) => {
    if (!exports.gmtZoneRegex.test(timezone))
        return timezone;
    return (0, exports.transformGmtZoneName)(timezone);
};
exports.getTimezoneLabel = getTimezoneLabel;
const getTimezoneValue = (timezone) => ({
    value: timezone,
    label: (0, exports.getTimezoneLabel)(timezone),
});
exports.getTimezoneValue = getTimezoneValue;
const momentToTimeInputValue = (time = (0, moment_timezone_1.default)(), format = `${exports.isoFormattingDateFormat}\\T${exports.isoTimeFormat}`) => time.clone().locale('en').format(format);
exports.momentToTimeInputValue = momentToTimeInputValue;

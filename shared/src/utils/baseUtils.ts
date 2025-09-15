import { PickerValue } from "@mui/x-date-pickers/internals";
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { TFunction } from 'i18next';

// Extend dayjs with timezone support
dayjs.extend(utc);
dayjs.extend(timezone);


export enum ApiResponseStatus {
    SUCCESS = 'SUCCESS',
    FAILURE = 'FAILURE',
    NETWORK_ERROR = 'NETWORK_ERROR'
}

export type DateRangeType = 'Today' | 'Yesterday' | 'This Week' | 'Last Month' | 'Last 7' | 'Last 30' | 'This Month' | 'Last Year' | 'Custom';

export const dateRangeLabelMapping: { [key in DateRangeType]: string } = {
    'Today': 'COMMON.TODAY',
    'Yesterday': 'COMMON.YESTERDAY',
    'Last 7': 'COMMON.LAST_7_DAYS',
    'Last 30': 'COMMON.LAST_30_DAYS',
      "This Week": 'COMMON.THIS_WEEK',
  "Last Month": 'COMMON.LAST_MONTH',
    'This Month': 'COMMON.THIS_MONTH',
    'Last Year': 'COMMON.LAST_YEAR',
    'Custom': 'COMMON.CUSTOM'
}

export function getDateRange(range: DateRangeType, timezone: string, keepPickerValue?: boolean): { from: string | PickerValue; to: string | PickerValue } {
    // Get current time in user's timezone
    const now = dayjs().tz(timezone);
    let start: dayjs.Dayjs;
    let end: dayjs.Dayjs;

    switch (range) {
        case 'Today':
            start = now.startOf('day'); // 00:00:00 in user timezone
            end = now.endOf('day');     // 23:59:59 in user timezone
            break;
        case 'Yesterday':
            start = now.subtract(1, 'day').startOf('day'); // Yesterday at 00:00:00
            end = now.subtract(1, 'day').endOf('day');     // Yesterday at 23:59:59
            break;
        case 'This Week':
            start = now.startOf('week'); // Start of current week (Monday at 00:00:00)
            end = now.endOf('day');      // Today at 23:59:59
            break;
        case 'Last Month':
            start = now.subtract(1, 'month').startOf('month'); // First day of last month at 00:00:00
            end = now.subtract(1, 'month').endOf('month');     // Last day of last month at 23:59:59
            break;
        case 'Last 7':
            start = now.subtract(6, 'day').startOf('day'); // 6 days ago at 00:00:00
            end = now.endOf('day');                        // Today at 23:59:59
            break;
        case 'Last 30':
            start = now.subtract(29, 'day').startOf('day'); // 29 days ago at 00:00:00
            end = now.endOf('day');                         // Today at 23:59:59
            break;
        case 'This Month':
            start = now.startOf('month'); // First day of current month at 00:00:00
            end = now.endOf('day');       // Today at 23:59:59
            break;
        case 'Last Year':
            start = now.subtract(12, 'month').startOf('day'); // 12 months ago at 00:00:00
            end = now.endOf('day');                           // Today at 23:59:59
            break;
        case 'Custom':
            return { from: null, to: null };
        default:
            throw new Error('Invalid date range');

    }

    return {
        from: keepPickerValue ? start : start.toISOString(), // Convert to UTC ISO string
        to: keepPickerValue ? end : end.toISOString(),   // Convert to UTC ISO string
    };
}

export const dateRange: DateRangeType[] = ['Today', 'Yesterday', 'Last 7', 'Last 30', 'This Month',"Last Month", 'Last Year', 'Custom'];

export function getDayRangeFilterOptions(t: TFunction<"translations">) {
    return dateRange.map(range => ({
        label: t(dateRangeLabelMapping[range]),
        value: range
    }));
}
import dayjs, { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

// Extend dayjs with timezone support
dayjs.extend(utc);
dayjs.extend(timezone);

type FormatDateMode = "datetime" | "date";

/**
 * Formats a date string into "18 Jul '25, 10:45 am" or "18 Jul '25" format.
 * @param dateStr The date string to format.
 * @param mode "datetime" for date and time, "date" for only date. Default is "datetime".
 * @returns Formatted date string.
 */
export const formatDate = (dateStr?: string, mode: FormatDateMode = "datetime"): string => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "-";

    const day = date.getDate().toString().padStart(2, "0");
    const month = date.toLocaleDateString("en-GB", { month: "short" });
    const year = date.getFullYear().toString().slice(-2);

    if (mode === "date") {
        // 18 Jul '25
        return `${day} ${month} '${year}`;
    }

    let hour = date.getHours();
    const minute = date.getMinutes().toString().padStart(2, "0");
    const ampm = hour >= 12 ? "pm" : "am";
    hour = hour % 12;
    if (hour === 0) hour = 12;

    // 18 Jul 25, 10:45 am
    return `${day} ${month} ${year}, ${hour}:${minute} ${ampm}`;
};

/**
 * Formats an ISO datetime string to "18 Jul 25, 10:45 am" format in the specified timezone.
 * 
 * @param isoDateString - ISO format datetime string (YYYY-MM-DDTHH:mm:ssZ)
 * @param userTimezone - Timezone string (e.g., "America/New_York", "Asia/Kolkata", "Europe/London")
 * @param showTime - Whether to include time in the format. Default is true.
 * @returns Formatted date string like "18 Jul 25, 10:45 am" or "18 Jul 25"
 */
export const formatDateWithTimezone = (
    isoDateString: string,
    userTimezone: string,
    showTime: boolean = true
): string => {
    if (!isoDateString) return "-";

    // Parse the ISO string and convert to user's timezone
    const date = dayjs(isoDateString).tz(userTimezone);

    if (!date.isValid()) return "-";

    // Get day, month, year
    const day = date.date();
    const month = date.format('MMM'); // Short month name (Jan, Feb, etc.)
    const year = date.format('YY');   // Last 2 digits of year

    let formattedDate = `${day} ${month} ${year}`;

    if (showTime) {
        // Format time in 12-hour format with am/pm
        const time = date.format('h:mm a'); // 10:45 am
        formattedDate += `, ${time}`;
    }

    return formattedDate;
};

/**
 * Gets the current dayjs datetime object in the specified timezone.
 * 
 * @param timezone - Timezone string (e.g., "America/New_York", "Asia/Kolkata", "Europe/London")
 * @returns dayjs object representing current time in the specified timezone
 */
export const getCurrentDateTimeInTimezone = (timezone: string) => {
    return dayjs().tz(timezone);
};

/**
 * Gets the current date and time formatted as "DD MMM YY h:mm a" in the specified timezone.
 * 
 * @param timezone - Timezone string (e.g., "America/New_York", "Asia/Kolkata", "Europe/London")
 * @returns Formatted current date/time string like "02 Dec 25 2:30 pm"
 */
export const getCurrentFormattedDateTime = (timezone: string): string => {
    const currentDateTime = dayjs().tz(timezone);
    
    // Format as DD MMM YY h:mm a
    const day = currentDateTime.format('DD');        // 02
    const month = currentDateTime.format('MMM');     // Dec
    const year = currentDateTime.format('YY');       // 25
    const time = currentDateTime.format('h:mm a');   // 2:30 pm
    
    return `${day} ${month} ${year} ${time}`;
};

export const getDateFromIsoString = (isoDateString: string, timeZone: string): Dayjs | null => {
    const date = dayjs(isoDateString).tz(timeZone);
    return date.isValid() ? date : null;
}

/**
 * Converts a dayjs object to ISO string while preserving the intended timezone.
 * This is useful when working with timezone-aware date pickers where you want
 * the ISO string to represent the time as selected in that timezone.
 * 
 * @param dayjsObject - dayjs object from a timezone-aware picker
 * @param targetTimezone - the timezone the time was selected in
 * @returns ISO string representing the time in the target timezone
 */
export const toISOStringInTargetTimezone = (dayjsObject: Dayjs | null, targetTimezone: string): string => {
    if (!dayjsObject) return '';
    
    // Create a new dayjs object in the target timezone using the local time values
    // This ensures the ISO string represents the time as displayed in the picker
    const timeInTargetTimezone = dayjs.tz(dayjsObject.format('YYYY-MM-DDTHH:mm:ss'), targetTimezone);
    
    // Return the ISO string (this will be in UTC but represents the correct moment)
    return timeInTargetTimezone.toISOString();
};

/**
 * Calculates the difference between two ISO date strings and returns it in short format (2d 3h 2m).
 * Uses dayjs for accurate date calculations.
 * 
 * @param startIsoString - Start date as ISO string (YYYY-MM-DDTHH:mm:ssZ)
 * @param endIsoString - End date as ISO string (YYYY-MM-DDTHH:mm:ssZ)
 * @returns Formatted time difference string in format "2d 3h 2m"
 */
export const getTimeDifference = (
    startIsoString: string, 
    endIsoString: string
): string => {
    // Validate input strings
    if (!startIsoString || !endIsoString) {
        return '-';
    }

    const startDate = dayjs(startIsoString);
    const endDate = dayjs(endIsoString);

    // Validate that both dates are valid
    if (!startDate.isValid() || !endDate.isValid()) {
        return '-';
    }

    // Use dayjs to calculate differences in each unit
    const laterDate = endDate.isAfter(startDate) ? endDate : startDate;
    const earlierDate = endDate.isAfter(startDate) ? startDate : endDate;

    // Calculate days difference
    const days = laterDate.diff(earlierDate, 'day');
    
    // Calculate remaining hours after removing days
    const remainingAfterDays = laterDate.subtract(days, 'day');
    const hours = remainingAfterDays.diff(earlierDate, 'hour');
    
    // Calculate remaining minutes after removing days and hours
    const remainingAfterHours = remainingAfterDays.subtract(hours, 'hour');
    const minutes = remainingAfterHours.diff(earlierDate, 'minute');

    // Handle zero difference
    if (days === 0 && hours === 0 && minutes === 0) {
        return '0m';
    }

    // Build the short format parts
    const parts: string[] = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);

    return parts.join(' ');
};



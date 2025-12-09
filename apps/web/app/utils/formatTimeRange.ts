import { format, isToday, isTomorrow } from "date-fns";

export function formatTimeRange(start: Date, end: Date): string {
    let dayLabel: string;

    if (isToday(start)) {
        dayLabel = "Today";
    } else if (isTomorrow(start)) {
        dayLabel = "Tomorrow";
    } else {
        // Example: October 21st 2025
        dayLabel = format(start, "MMMM do yyyy");
    }

    const startTime = format(start, "HH:mm");
    const endTime = format(end, "HH:mm");

    return `${dayLabel}, ${startTime} - ${endTime}`;
}

export const formatTimeSpan = (timeInput: any): string => {
    if (!timeInput) return 'N/A';

    // Handle string "HH:mm:ss" or "HH:mm"
    if (typeof timeInput === 'string') {
        const parts = timeInput.split(':');
        if (parts.length >= 2) {
            return `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}`;
        }
        return 'N/A';
    }


    if (typeof timeInput === 'object') {
        const hours = timeInput.hours ?? 0;
        const minutes = (timeInput.minutes ?? 0).toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    }

    return 'N/A'; // Fallback for unknown type
};

export const formatTimeRange = (startTimeInput: any, endTimeInput: any): string => {
    return `${formatTimeSpan(startTimeInput)} - ${formatTimeSpan(endTimeInput)}`;
};

export const parseTimeStringToTimeSpanObject = (timeStr: string): { hours: number; minutes: number; seconds: number } | null => {
    if (!timeStr) return null;
    const parts = timeStr.split(':');
    if (parts.length < 2 || parts.length > 3) return null; // Must be HH:MM or HH:MM:SS

    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);
    const seconds = parts[2] ? parseInt(parts[2], 10) : 0;

    if (isNaN(hours) || isNaN(minutes) || isNaN(seconds) ||
        hours < 0 || hours > 23 || minutes < 0 || minutes > 59 || seconds < 0 || seconds > 59) {
        return null;
    }

    return { hours, minutes, seconds };
};
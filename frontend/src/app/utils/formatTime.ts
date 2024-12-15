export const formatTimeHourMinutes = (timestamp: string) => {
    const date = new Date(timestamp);
    
    return new Intl.DateTimeFormat('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    }).format(date);
};
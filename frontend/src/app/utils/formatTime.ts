export const formatTimeHourMinutes = (timestamp: string) => {
    const date = new Date(timestamp);

    return `${date.getHours()}:${date.getMinutes()}`;
};
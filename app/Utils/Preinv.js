// utils/flightUtils.js

export function processFlightData(data) {
    const result = {};

    data.forEach(item => {
        const [hours, minutes] = item.time_difference.split(':').map(Number);
        const totalHours = hours + (minutes > 0 ? 1 : 0);

        if (!result[item.AirlineCode]) {
            result[item.AirlineCode] = {
                AirlineCode: item.AirlineCode,
                Flight: new Set(),
                Time: 0,
                Dates: new Set()
            };
        }

        result[item.AirlineCode].Flight.add(`${item.AirlineCode}${item.FlightNo}`)
        result[item.AirlineCode].Time += totalHours;
        result[item.AirlineCode].Dates.add(item.DateVal.split('-')[2]);
    });

    return Object.values(result).map(flight => ({
        AirlineCode: flight.AirlineCode,
        Flight: Array.from(flight.Flight).join(','),
        Time: flight.Time,
        Dates: Array.from(flight.Dates).sort()
    }));
}

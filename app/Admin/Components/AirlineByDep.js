import { useState, useEffect } from "react";
import { getData } from "@/app/Utils/RequestHandle";

function AirlineByDep({ depid, selectedAirline, onSelectAirline }) {
    const [airlinedep, setAirlinedep] = useState([]);
    const [selectedAirlineId, setSelectedAirlineId] = useState(selectedAirline || '');

    const getairlinelist = async () => {
        const response = await getData(`${process.env.NEXT_PUBLIC_API_URL}/airline/airlinebydev/${depid}`);
        if (response) {
            setAirlinedep(response);
        }
    };

    useEffect(() => {
        getairlinelist();
    }, [depid]);

    const handleChange = (event) => {
        const value = event.target.value;
        setSelectedAirlineId(value);
        onSelectAirline(value); // Notify parent component of the selected airline
    };

    return (
        <select
            className="p-2 text-black bg-white border"
            value={selectedAirlineId}
            onChange={handleChange}
        >
            <option value='' disabled>กรุณาเลือกสายการบิน</option>
            {airlinedep.map((airline) => (
                <option key={airline.id} value={airline.id}>
                    {airline.Name} - {airline.IATACode}
                </option>
            ))}
        </select>
    );
}

export default AirlineByDep;

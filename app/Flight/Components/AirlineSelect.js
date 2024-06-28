"use client"

import { useEffect, useState } from "react";
import { getData } from "@/app/Utils/RequestHandle";

function AirlineSelect({ onAirlineSelect }) {
    const [departmentid, setDepartmentid] = useState();
    const [airlinelist, setAirlinelist] = useState([]);
    const [selectedAirline, setSelectedAirline] = useState("");
    const [sessiondata, setSessiondata] = useState("");

    useEffect(() => {
        setSessiondata(JSON.parse(sessionStorage.getItem('usdt')));

    }, [])

    // Use Effect to set department id from session data
    useEffect(() => {
        if (sessiondata && sessiondata.DepartmentID) {
            setDepartmentid(sessiondata.DepartmentID);
        }
    }, [sessiondata]);

    // Use Effect to get airline list when departmentid changes
    useEffect(() => {
        if (departmentid) {
            getairlinelist();
        }
    }, [departmentid]);

    // Function to get airline list
    const getairlinelist = async () => {
        const response = await getData(`${process.env.NEXT_PUBLIC_API_URL}/airline/airlinebydev/${departmentid}`);
        setAirlinelist(response);
    };

    // Handle change event for select element
    const handleChange = (event) => {
        const selectedValue = event.target.value;
        setSelectedAirline(selectedValue);
        if (onAirlineSelect) {
            onAirlineSelect(selectedValue);
        }
    };

    return (
        <div>
            <div>กรุณาเลือกสายการบิน</div>
            <select value={selectedAirline} onChange={handleChange} required>
                <option>เลือกสายการบิน</option>
                <option value="" disabled>กรุณาเลือกสายการบิน</option>
                {airlinelist && airlinelist.map((airline, index) => (
                    <option key={index} value={airline.id}>{airline.Name}</option>
                ))}
            </select>
        </div>
    );
}

export default AirlineSelect;

"use client";

import { useEffect, useState } from "react";
import { getData } from "@/app/Utils/RequestHandle";

function AirlineSelect({ onAirlineSelect }) {
    const [departmentid, setDepartmentid] = useState();
    const [airlinelist, setAirlinelist] = useState([]);
    const [selectedAirline, setSelectedAirline] = useState("");
    const [sessiondata, setSessiondata] = useState("");

    useEffect(() => {
        const session = sessionStorage.getItem('usdt');
        if (session) {
            setSessiondata(JSON.parse(session));
        }
    }, []);

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
        if (response) {
            setAirlinelist(response);
        }
    };

    // Handle change event for select element
    const handleChange = (event) => {
        const selectedValue = event.target.value;
        console.log('====================================');
        console.log(selectedValue);
        console.log('====================================');
        setSelectedAirline(selectedValue);
        if (onAirlineSelect) {
            onAirlineSelect(selectedValue);
        }
    };

    return (
        <div >
            <div>กรุณาเลือกสายการบิน</div>
            <select value={selectedAirline} onChange={handleChange} required>
                <option value="">เลือกสายการบิน</option>
                {airlinelist && airlinelist.map((airline) => (
                    <option key={airline.id} value={airline.id}>
                        {airline.Name} -  {airline.IATACode}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default AirlineSelect;

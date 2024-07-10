'use client'

import { getData } from "@/app/Utils/RequestHandle";
import { useEffect, useState } from "react";
import { FaPlane, FaPlaneArrival } from "react-icons/fa";

function Page() {
    const [airlinelist, setAirlinelist] = useState([]);
    const [sessiondata, setSessiondata] = useState(null);
    const [departmentid, setDepartmentid] = useState(null);
    const [flights, setFlights] = useState([]);
    const [selectedAirline, setSelectedAirline] = useState(null);

    useEffect(() => {
        const session = sessionStorage.getItem('usdt');
        if (session) {
            setSessiondata(JSON.parse(session));
        }
    }, []);

    useEffect(() => {
        if (sessiondata && sessiondata.DepartmentID) {
            setDepartmentid(sessiondata.DepartmentID);
        }
    }, [sessiondata]);

    useEffect(() => {
        if (departmentid) {
            getairlinelist();
        }
    }, [departmentid]);

    useEffect(() => {
        if (selectedAirline) {
            getFlights(selectedAirline.id);
        }
    }, [selectedAirline]);

    const getFlights = async (airlineId) => {
        try {
            const response = await getData(`${process.env.NEXT_PUBLIC_API_URL}/flight/airlineflight/${airlineId}`);
            setFlights(response);
        } catch (error) {
            console.error("Error fetching flights:", error);
            setFlights([]); // Clear flights if there's an error
        }
    };

    const getairlinelist = async () => {
        const response = await getData(`${process.env.NEXT_PUBLIC_API_URL}/airline/airlinebydev/${departmentid}`);
        if (response) {
            setAirlinelist(response);
            console.log('Airline list:', response); // Added log to check the response
        } else {
            console.log('No response from the API');
        }
    };

    const handleAirlineClick = (airline) => {
        setSelectedAirline(airline);
        setFlights([]); // Clear flights before fetching new ones
    };

    return (
        <div className="flex ">
            <div className="w-2/5 text-2xl bg-slate-700 shadow-lg text-white p-4 rounded-lg m-2">
                <div className="cardheader">รายการสายการบิน</div>
                <ul>
                    {airlinelist.map((airline) => (
                        <li
                            className="flex items-center my-1 p-2 rounded-md hover:bg-slate-500 cursor-pointer"
                            key={airline.id}
                            onClick={() => handleAirlineClick(airline)}
                        >
                            <FaPlane color="yellow" className="mr-2" />
                            {airline.Name} - {airline.IATACode}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="w-3/5 text-2xl bg-slate-700 shadow-lg text-white p-4 rounded-lg m-2">
                <div className="cardheader">รายการเที่ยวบิน</div>
                {flights.length > 0 ? (
                    <ul>
                        {flights.map((flight) => (
                            <li key={flight.id} className="flex text-yellow-400" ><FaPlaneArrival className="mr-2"/> {flight.IATACode}{flight.FlightNo} - {flight.Route}</li>
                        ))}
                    </ul>
                ) : (
                    <p>No flights available for the selected airline.</p>
                )}
            </div>
        </div>
    );
}

export default Page;

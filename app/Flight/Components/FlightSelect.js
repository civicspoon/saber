import { useEffect, useState } from "react";
import { getData } from "@/app/Utils/RequestHandle";

function FlightSelect({ selectedAirline, onChange }) {
	const [flights, setFlights] = useState([]);

	useEffect(() => {
		if (selectedAirline) {
			getFlights(selectedAirline);
		}
	}, [selectedAirline]);

	const getFlights = async (airlineId) => {
		try {
			const response = await getData(
				`${process.env.NEXT_PUBLIC_API_URL}/flight/airlineflight/${airlineId}`
			);
			setFlights(response);
		} catch (error) {
			console.error("Error fetching flights:", error);
		}
	};

	const handleFlightChange = (event) => {
		const selectedFlight = event.target.value;
		onChange(selectedFlight); // Call the parent's onChange handler
	};

	return (
		<div>
			<div>กรุณาเลือกเที่ยวบิน</div>
			<select required onChange={handleFlightChange}>
				<option value="">Select Flight</option>
				{flights.map((flight, index) => (
					<option key={index} value={flight.fid}>
						{flight.IATACode}{flight.FlightNo} - {flight.Route}
					</option>
				))}
			</select>
		</div>
	);
}

export default FlightSelect;

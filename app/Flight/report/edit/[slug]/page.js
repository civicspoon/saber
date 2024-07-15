'use client';

import DateTimePicker from "@/app/Components/DateTimePicker";
import AirlineSelect from "@/app/Flight/Components/AirlineSelect";
import FlightSelect from "@/app/Flight/Components/FlightSelect";
import { formatDateToThaiLocale } from "@/app/Utils/DateTime";
import { getData } from "@/app/Utils/RequestHandle";
import { useEffect, useState } from "react";

function Page({ params }) {
    // State variables
    const months = [
        'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
        'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
    ];

    const [initdata, setInitdata] = useState({});
    const [timein, setTimein] = useState({ date: '', month: '', year: '', hour: '', minute: '' });
    const [timeout, setTimeout] = useState({ date: '', month: '', year: '', hour: '', minute: '' });
    const [flightID, setFlightID] = useState(null);
    const [flightDetail, setFlightDetail] = useState({});
    const [updatedata, setUpdatedata] = useState({
        TimeIn: '',
        TimeOut: '',
        FlightID: '',
        Passenger: '',
        Remark: '',
        EditBy: '',
        updatedAt: '',
    });

    const mergeData = (initdata, updatedata) => ({
        TimeIn: updatedata.TimeIn || initdata.TimeIn,
        TimeOut: updatedata.TimeOut || initdata.TimeOut,
        FlightID: updatedata.FlightID || initdata.FlightID,
        Passenger: updatedata.Passenger || initdata.Passenger,
        Remark: updatedata.Remark || initdata.Remark,
        EditBy: updatedata.EditBy || initdata.EditBy,
        updatedAt: updatedata.updatedAt || initdata.updatedAt,
    });

    const mergedData = mergeData(initdata, updatedata);

    useEffect(() => {
        if (params.slug) {
            getInitdata();
        }
    }, [params.slug]);

    useEffect(() => {
        if (flightID) {
            getFlightDetail();
        }
    }, [flightID]);

    useEffect(() => {
        setUpdatedata(prevData => ({ ...prevData, FlightID: flightID }));
    }, [flightID]);

    const getInitdata = async () => {
        try {
            const response = await getData(`${process.env.NEXT_PUBLIC_API_URL}/inadhandling/${params.slug}`);
            if (response.inad) {
                setInitdata(response.inad);

                const timeInDate = new Date(response.inad.TimeIn);
                setTimein({
                    date: timeInDate.getDate().toString().padStart(2, '0'),
                    month: timeInDate.toLocaleString('th-TH', { month: 'long' }),
                    year: timeInDate.getFullYear().toString(),
                    hour: timeInDate.getHours().toString().padStart(2, '0'),
                    minute: timeInDate.getMinutes().toString().padStart(2, '0')
                });

                const timeOutDate = new Date(response.inad.TimeOut);
                setTimeout({
                    date: timeOutDate.getDate().toString().padStart(2, '0'),
                    month: timeOutDate.toLocaleString('th-TH', { month: 'long' }),
                    year: timeOutDate.getFullYear().toString(),
                    hour: timeOutDate.getHours().toString().padStart(2, '0'),
                    minute: timeOutDate.getMinutes().toString().padStart(2, '0')
                });

                setFlightID(response.inad.FlightID);
            }
        } catch (error) {
            console.error('Error fetching initial data:', error);
        }
    };

    const getFlightDetail = async () => {
        try {
            const response = await getData(`${process.env.NEXT_PUBLIC_API_URL}/flight/${flightID}`);
            if (response.length > 0) {
                setFlightDetail(response[0]);
                console.log('Flight Detail:', response[0]);
            }
        } catch (error) {
            console.error('Error fetching flight details:', error);
        }
    };

    const calculateTimeDifference = (startTime, endTime) => {
        let difference = Math.abs(endTime.getTime() - startTime.getTime());
        let hours = Math.floor(difference / (1000 * 60 * 60));
        let minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    };

    const handleDateTimeChange = (newDateTime, type) => {
        const mindex = months.indexOf(newDateTime.month) + 1;
        const formattedDate = `${newDateTime.year}-${mindex.toString().padStart(2, '0')}-${newDateTime.date.padStart(2, '0')} ${newDateTime.hour.padStart(2, '0')}:${newDateTime.minute.padStart(2, '0')}`;

        if (type === 'timein') {
            setTimein(newDateTime);
            setUpdatedata(prevData => ({ ...prevData, TimeIn: formattedDate }));
        } else if (type === 'timeout') {
            setTimeout(newDateTime);
            setUpdatedata(prevData => ({ ...prevData, TimeOut: formattedDate }));
        }
    };

    const [selectedAirline, setSelectedAirline] = useState("");
    const handleAirlineSelect = (selectedValue) => {
        setSelectedAirline(selectedValue);
    };

    const [selectedFlight, setSelectedFlight] = useState("");
    const handleFlightSelect = (selectedValue) => {
        setSelectedFlight(selectedValue);
        setFlightID(selectedValue);
    };

    const updateval = async () => {
        console.log(mergedData);
        // Here, you would make the API call to update the data on the server
        // await updateDataOnServer(mergedData);
    };

    return (
        <div className="bg-slate-700 rounded-lg p-4 flex-wrap">
            <div className="text-2xl font-semibold underline">รายละเอียด</div>
            <div className="flex flex-col items-center">
                <table className="rounded-t-lg overflow-hidden w-full">
                    <thead className="bg-gray-300 text-gray-900 border p-4">
                        <tr>
                            <th>Time IN</th>
                            <th>Time OUT</th>
                            <th>Hours</th>
                            <th>Flight</th>
                            <th>Route</th>
                            <th>Passenger</th>
                            <th>Remark</th>
                        </tr>
                    </thead>
                    <tbody>
                        {initdata.TimeIn ? (
                            <tr>
                                <td className="border px-2">{formatDateToThaiLocale(initdata.TimeIn)}</td>
                                <td className="border px-2">{formatDateToThaiLocale(initdata.TimeOut)}</td>
                                <td className="border px-2">{calculateTimeDifference(new Date(initdata.TimeIn), new Date(initdata.TimeOut))}</td>
                                <td className="border px-2">{flightDetail.IATACode}{flightDetail.FlightNo}</td>
                                <td className="border px-2">{flightDetail.Route}</td>
                                <td className="border px-2">{initdata.Passenger}</td>
                                <td className="border px-2">{initdata.Remark}</td>
                            </tr>
                        ) : (
                            <tr>
                                <td colSpan="7" className="border px-2">Loading...</td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {initdata.TimeIn && (
                    <div className="flex mt-4 flex-wrap w-full">
                        <div className="flex w-auto">
                            <DateTimePicker
                                Label="แก้ไขเวลาเริ่ม"
                                initialDateTime={timein}
                                onDateTimeChange={(newDateTime) => handleDateTimeChange(newDateTime, 'timein')}
                            />
                            <DateTimePicker
                                Label="แก้ไขเวลาสิ้นสุด"
                                initialDateTime={timeout}
                                onDateTimeChange={(newDateTime) => handleDateTimeChange(newDateTime, 'timeout')}
                            />
                        </div>
                        <div className="flex w-auto">
                            <AirlineSelect onAirlineSelect={handleAirlineSelect} />
                            <FlightSelect selectedAirline={selectedAirline} onChange={handleFlightSelect} />
                        </div>
                        <div>
                            <button onClick={updateval}>Update</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Page;

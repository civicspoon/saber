"use client";
import { useEffect, useState } from "react";
import { FaSearch, FaCheckCircle } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import CheckHandle from "../../Components/CheckHandle";
import AirlineByDep from "../../Components/AirlineByDep";
import { getData, postData } from "@/app/Utils/RequestHandle";
import { formatDate } from "@/app/Utils/DateTime";

function Page({ params }) {
    const param = params.dep;
    const depName = decodeURIComponent(param[1]);
    const depid = param[0];
    const initialMonth = parseInt(param[2], 10); // Ensure these are integers
    const initialYear = parseInt(param[3], 10);

    const [selectedAirline, setSelectedAirline] = useState('');
    const [month, setMonth] = useState(initialMonth); // Initializing with correct values
    const [year, setYear] = useState(initialYear);
    const [handlelist, setHandlelist] = useState([]);

    const thaiMonths = [
        'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
        'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
    ];

    function HHMM(dateString) {
        const date = new Date(dateString);
        date.setHours(date.getHours() - 7);

        const day = date.getDate().toString().padStart(2, '0');
        const month = date.toLocaleString('default', { month: 'long' });
        const year = date.getFullYear();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');

        return `${hours}:${minutes}`;
    }

    const handleSelectAirline = (airlineId) => {
        setSelectedAirline(airlineId);
    };

    const handleMonthChange = (event) => {
        setMonth(parseInt(event.target.value, 10));
    };

    const handleYearChange = (event) => {
        setYear(parseInt(event.target.value, 10));
    };

    const getlist = async () => {
        let url = `${process.env.NEXT_PUBLIC_API_URL}/inadhandling/adminview?month=${month}&year=${year}`;
        if (selectedAirline) {
            url += `&airlineid=${selectedAirline}`;
        } else {
            url += `&depid=${depid}`;
        }
        const response = await getData(url);
        setHandlelist(response);
    };

    useEffect(() => {
        getlist();
    }, [depid, selectedAirline, month, year]);

    const ApproveClick = async (id, status) => {
        try {
            // Ensure id is a number and status is a boolean
            if (typeof id !== 'number' || typeof status !== 'boolean') {
                throw new Error('Invalid id or status value');
            }

            // Prepare the data to send in the request
            const data = {
                id,
                accept: status,
            };

            // Make a PUT request to the API
            const result = await postData(`${process.env.NEXT_PUBLIC_API_URL}/inadhandling/approve`, data);

            // Optionally, handle the response data if needed
            console.log(result.message);

            // Refresh the list after successful update
            getlist();
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    return (
        <div className="flex-1 text-black p-4">
            <div className="text-2xl font-semibold mt-2">{depName}</div>
            <div className="flex items-center p-4 m-2 shadow-lg my-2 rounded-lg">
                <AirlineByDep
                    depid={depid}
                    selectedAirline={selectedAirline}
                    onSelectAirline={handleSelectAirline}
                />
                เดือน
                <select
                    className="p-2 text-black bg-white border"
                    value={month}
                    onChange={handleMonthChange}
                >
                    <option value='' disabled>กรุณาเลือกเดือน</option>
                    {thaiMonths.map((monthName, index) => (
                        <option key={index} value={index + 1}>
                            {monthName}
                        </option>
                    ))}
                </select>
                <span>ปี </span>
                <input
                    className="p-2 text-black bg-white border"
                    type="number"
                    min={2004}
                    value={year}
                    onChange={handleYearChange}
                />
                <span>
                    <button onClick={getlist}>
                        <FaSearch />
                    </button>
                </span>
            </div>

            <div id="res" className="flex mt-5">
                <CheckHandle deip={depid} month={month} year={year} />
            </div>

            <div className="flex-1 mt-4 p-2 bg-gray-50 rounded-lg shadow-md shadow-gray-400">
                {handlelist.length > 0 ? (
                    <table className="w-full">
                        <thead>
                            <tr>
                                <th className="px-4">#</th>
                                <th className="px-4">Date</th>
                                <th className="px-4">FlightNo</th>
                                <th className="px-4">Route</th>
                                <th className="px-4">TimeIn</th>
                                <th className="px-4">TimeOut</th>
                                <th className="px-4">Hours</th>
                                <th className="px-4">PaxName</th>
                                <th className="px-4">Remark</th>
                                <th className="px-4">Approved</th>
                                <th className="px-4">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {handlelist.map((item, index) => (
                                <tr key={item.id}>
                                    <td className="text-center border-gray-400 border border-collapse">{index + 1}</td>
                                    <td className="text-center border-gray-400 border border-collapse">{formatDate(item.DateVal)}</td>
                                    <td className="px-2 border-gray-400 border border-collapse uppercase">{item.AirlineCode}{item.FlightNo}</td>
                                    <td className="px-2 border-gray-400 border border-collapse">{item.Route}</td>
                                    <td className="text-center border-gray-400 border border-collapse">{HHMM(item.TimeIn)}</td>
                                    <td className="text-center border-gray-400 border border-collapse">{HHMM(item.TimeOut)}</td>
                                    <td className="text-center border-gray-400 border border-collapse">{item.time_difference}</td>
                                    <td className="px-2 border-gray-400 border border-collapse">{item.Passenger}</td>
                                    <td className="px-2 border-gray-400 border border-collapse">{item.Remark}</td>
                                    <td className="px-2 border-gray-400 border border-collapse">
                                        {item.Accept === 1 ? (
                                            <span className="inline-flex items-center px-3 py-1 text-sm font-medium text-green-100 bg-green-600 rounded-full">Accepted</span>
                                        ) : item.Accept === 0 ? (
                                            <span className="inline-flex items-center px-3 py-1 text-sm font-medium text-red-100 bg-red-600 rounded-full">Rejected</span>
                                        ) : null}
                                    </td>
                                    <td className="flex px-2 border-gray-400 border border-collapse justify-between items-center">
                                        <button onClick={() => ApproveClick(item.id, true)}><FaCheckCircle color="green" /> Approve</button>
                                        <button onClick={() => ApproveClick(item.id, false)}><ImCross color="red" /> Reject</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="text-center bg-red-500 p-4">ไม่พบข้อมูล</div>
                )}
            </div>
        </div>
    );
}

export default Page;

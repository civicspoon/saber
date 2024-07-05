'use client'
import { useState } from "react";
import { FaEdit, FaPrint, FaSearch, FaTrash } from "react-icons/fa";
import { postData } from "@/app/Utils/RequestHandle";
import FlightSelect from "../Components/FlightSelect";
import AirlineSelect from "../Components/AirlineSelect";
import Swal from "sweetalert2";
import { formatDate } from "@/app/Utils/DateTime";

function Page() {
    const [userdata, setUserdata] = useState([]);
    const [airlineid, setAirlineID] = useState(null);
    const [month, setMonth] = useState(null);
    const [year, setYear] = useState(2024);


    const months = [
        { value: 1, label: "มกราคม" },
        { value: 2, label: "กุมภาพันธ์" },
        { value: 3, label: "มีนาคม" },
        { value: 4, label: "เมษายน" },
        { value: 5, label: "พฤษภาคม" },
        { value: 6, label: "มิถุนายน" },
        { value: 7, label: "กรกฎาคม" },
        { value: 8, label: "สิงหาคม" },
        { value: 9, label: "กันยายน" },
        { value: 10, label: "ตุลาคม" },
        { value: 11, label: "พฤศจิกายน" },
        { value: 12, label: "ธันวาคม" }
    ];


    const handleSearch = async () => {
        try {

            const data = {
                airlineid: airlineid,
                month: month,
                year: year,
            }
            const response = await postData(`${process.env.NEXT_PUBLIC_API_URL}/report/search`, data);
            if (response.result.length === 0) {
                Swal.fire({
                    title: "Info",
                    text: "ไม่พบข้อมูล",
                    icon: "info"
                });
                setUserdata([])
            } else {
                setUserdata(response.result);
            }

        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const handleAirlineSelect = (selectedAirline) => {
        setAirlineID(selectedAirline);
    };

    return (
        <div className="flex-1">
            <div className="card-header">
                รายการ AOTGA INAD
            </div>
            <div className="flex justify-center items-center">
                <div>
                    <AirlineSelect onAirlineSelect={handleAirlineSelect} />

                </div>

                <div>
                    <select onChange={(e) => setMonth(e.target.value)} className="mt-7">
                        <option value="">เดือน</option>
                        {months.map((month) => (
                            <option key={month.value} value={month.value}>
                                {month.label}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <input type="number" className="mt-7" min={2024} value={year} onChange={(e) => setYear(e.target.value)} />

                </div>
                <div>
                    <button onClick={handleSearch} className="mt-7"><FaSearch /> รายการ</button>
                </div>
            </div>
            {userdata.length === 0 ? ( <></> ) : (    <div className="flex ">
                <button><FaPrint className="mr-2" /> พิมพ์ Summary</button>
                <button><FaPrint className="mr-2" /> พิมพ์ Report</button>
            </div> )}
            <div className="flex-1">
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
                            <th className="px-4">Action</th>
                            {/* เพิ่มคอลัมน์ตามข้อมูลที่ต้องการแสดง */}
                        </tr>
                    </thead>
                    <tbody>
                        {userdata.length === 0 ? (
                            <tr>
                                <td colSpan="9" className="text-center bg-red-500 text-">ไม่พบข้อมูล</td>
                            </tr>
                        ) : (
                            userdata.map((item, index) => (
                                <tr key={index}>
                                    <td  className=" text-center border-gray-400 border border-collapse">{index + 1}</td>
                                    <td  className="text-center  border-gray-400 border border-collapse">{formatDate(item.DateIN)}</td>  
                                     <td className="px-2  border-gray-400 border border-collapse">{item.IATACode}{item.FlightNo}</td>
                                    <td className="px-2  border-gray-400 border border-collapse">{item.Route}</td>
                                    <td className=" text-center border-gray-400 border border-collapse">{item.Time_IN.slice(0,-3)}</td>
                                    <td className=" text-center border-gray-400 border border-collapse">{item.Time_OUT.slice(0,-3)}</td>
                                    <td className="text-center border-gray-400 border border-collapse">{item.Diff.slice(0,-3)}</td>
                                 
                                    <td className="px-2  border-gray-400 border border-collapse">{item.Passenger}</td>
                                    <td className="px-2  border-gray-400 border border-collapse">{item.Remark}</td>
                                    <td className="px-2  border-gray-400 border border-collapse flex justify-between"><button><FaEdit  color="yellow" /></button> <button><FaTrash color="red" /></button></td>
                                    {/* เพิ่มข้อมูลคอลัมน์ตามที่ต้องการแสดง */}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Page;

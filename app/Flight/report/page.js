"use client";

import { useState } from "react";
import { FaEdit, FaPrint, FaSearch, FaTrash } from "react-icons/fa";
import { deleteData, getData, postData } from "@/app/Utils/RequestHandle";
import AirlineSelect from "../Components/AirlineSelect";
import Swal from "sweetalert2";
import { formatDate } from "@/app/Utils/DateTime";
import { useRouter } from "next/navigation";
import ThisMonthHandle from "../Components/ThisMonthHandle";
import Modal from "@/app/Components/Modal";
import EditRecord from "../Components/EditRecord";

function Page() {
    const [userdata, setUserdata] = useState([]);
    const [airlineid, setAirlineID] = useState(null);
    const [month, setMonth] = useState(null);
    const [year, setYear] = useState(2024);
    const router = useRouter();
    const [recordID, setRecordID] = useState();

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

            if (!airlineid) {
               const usdt = JSON.parse(sessionStorage.getItem('usdt'));
               console.log('====================================');
              const departmentid = usdt.DepartmentID;
               console.log('====================================');
                // const data = { airlineid, month, year };
                const response = await getData(`${process.env.NEXT_PUBLIC_API_URL}/inadhandling/monthhandling/${departmentid}/${month}/${year}`);
                if (response.result.length === 0) {
                    Swal.fire({
                        title: "Info",
                        text: "ไม่พบข้อมูล",
                        icon: "info"
                    });
                    setUserdata([]);
                } else {
                    setUserdata(response.result);
                }
            } else {
                const data = { airlineid, month, year };
                const response = await postData(`${process.env.NEXT_PUBLIC_API_URL}/report/search`, data);
                if (response.result.length === 0) {
                    Swal.fire({
                        title: "Info",
                        text: "ไม่พบข้อมูล",
                        icon: "info"
                    });
                    setUserdata([]);
                } else {
                    setUserdata(response.result);
                }
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const handleAirlineSelect = (selectedAirline) => {
        setAirlineID(selectedAirline);
    };

    const editClick = (id) => {
        router.push(`report/edit/${id}`);
    };

    const deleted = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                const response = await deleteData(`${process.env.NEXT_PUBLIC_API_URL}/inadhandling/delete/${id}`);
                if (response.status === 200) {
                    Swal.fire('Deleted!', 'Your record has been deleted.', 'success');
                    setUserdata(userdata.filter((item) => item.id !== id));
                    handleSearch()
                } else {
                    Swal.fire('Error!', 'There was a problem deleting the record.', 'error');
                }
            } catch (error) {
                console.error("Error deleting data:", error);
                Swal.fire('Error!', 'There was a problem deleting the record.', 'error');
            }
        }
    };

    return (
        <div className="flex-1">
            <div className="card-header">รายการ AOTGA INAD</div>
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
                    <input
                        type="number"
                        className="mt-7"
                        min={2024}
                        value={year}
                        onChange={(e) => setYear(parseInt(e.target.value))}
                    />
                </div>
                <div>
                    <button onClick={handleSearch} className="mt-7">
                        <FaSearch /> รายการ
                    </button>
                </div>
                
            </div>
<div className="text-center">* สามารถแสดงรายการทั้งหมดในเดือน-ปีที่ต้องการได้โดยไม่ต้องเลือกสายการบิน</div>
            <div className="flex-1 mt-4 p-2 bg-slate-700 rounded-lg shadow-md shadow-gray-400">
                {userdata.length > 0 ? (
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
                            </tr>
                        </thead>
                        <tbody>
                            {userdata.map((item, index) => (
                                <tr key={index}>
                                    <td className="text-center border-gray-400 border border-collapse">{index + 1}</td>
                                    <td className="text-center border-gray-400 border border-collapse">{formatDate(item.DateIN)}</td>
                                    <td className="px-2 border-gray-400 border border-collapse uppercase">{item.IATACode}{item.FlightNo}</td>
                                    <td className="px-2 border-gray-400 border border-collapse">{item.Route}</td>
                                    <td className="text-center border-gray-400 border border-collapse">{item.Time_IN.slice(0, -3)}</td>
                                    <td className="text-center border-gray-400 border border-collapse">{item.Time_OUT.slice(0, -3)}</td>
                                    <td className="text-center border-gray-400 border border-collapse">{item.Diff.slice(0, -3)}</td>
                                    <td className="px-2 border-gray-400 border border-collapse">{item.Passenger}</td>
                                    <td className="px-2 border-gray-400 border border-collapse">{item.Remark}</td>
                                    <td className="flex px-2 border-gray-400 border border-collapse  justify-between items-center">
                                        <button onClick={() => editClick(item.id)}><FaEdit color="yellow" /> แก้ไข</button>
                                        <button onClick={() => deleted(item.id)} ><FaTrash color="red" /> ลบ</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="text-center bg-red-500 p-4">ไม่พบข้อมูล</div>
                )}
            </div>

<Modal>
    {/* <EditRecord recordID={recordID} /> */}
</Modal>

        </div>
    );
}

export default Page;

"use client";

import { useState } from "react";
import { FaCheckCircle, FaEdit, FaEye, FaPrint, FaSearch, FaTrash } from "react-icons/fa";
import { deleteData, getData, postData } from "@/app/Utils/RequestHandle";
import AirlineSelect from "../Components/AirlineSelect";
import Swal from "sweetalert2";
import { formatDate } from "@/app/Utils/DateTime";
import { useRouter } from "next/navigation";
import Modal from "@/app/Components/Modal";
import { ImCross } from "react-icons/im";

function Page() {
    const [userdata, setUserdata] = useState([]);
    const [airlineid, setAirlineID] = useState(null);
    const [month, setMonth] = useState(null);
    const [year, setYear] = useState(2024);
    const router = useRouter();

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
            const usdt = JSON.parse(sessionStorage.getItem('usdt'));
            const departmentid = usdt.DepartmentID;

            if (!airlineid) {
                const response = await getData(`${process.env.NEXT_PUBLIC_API_URL}/inadhandling/monthhandling/${departmentid}/${month}/${year}`);
                setUserdata(response.result.length === 0 ? [] : response.result);
                if (response.result.length === 0) {
                    Swal.fire({
                        title: "Info",
                        text: "ไม่พบข้อมูล",
                        icon: "info"
                    });
                    return 0; // Return 0 if no data found
                } else {
                    return 1; // Return 1 if data found
                }
            } else {
                const data = { airlineid, month, year };
                const response = await postData(`${process.env.NEXT_PUBLIC_API_URL}/report/search`, data);
                setUserdata(response.result.length === 0 ? [] : response.result);
                if (response.result.length === 0) {
                    Swal.fire({
                        title: "Info",
                        text: "ไม่พบข้อมูล",
                        icon: "info"
                    });
                    return 0; // Return 0 if no data found
                } else {
                    return 1; // Return 1 if data found
                }
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            return 0; // Return 0 in case of error
        }
    };


    const handleAirlineSelect = (selectedAirline) => {
        setAirlineID(selectedAirline);
    };

    const editClick = (id) => {
        router.push(`report/edit/${id}`);
    };

    const viewReport = (report) => {
        if (userdata.length === 0) {
            Swal.fire({
                icon: "error",
                text: "ไม่มีข้อมูล",
                title: "เกิดข้อผิดพลาด"
            });
            return;
        }

        const url = `${process.env.NEXT_PUBLIC_BASE_URL}/Components/Print/${report}?airline=${airlineid}&month=${month}&year=${year}`;
        window.open(url, '_blank');
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
                    handleSearch();
                } else {
                    Swal.fire('Error!', 'There was a problem deleting the record.', 'error');
                }
            } catch (error) {
                console.error("Error deleting data:", error);
                Swal.fire('Error!', 'There was a problem deleting the record.', 'error');
            }
        }
    };

    const viewdep = async () => {
        if (!month) {
            Swal.fire({
                icon: "error",
                text: "กรุณาเลือกเดือน",
                title: "ตารางสรุปเกิดข้อผิดพลาด"
            });
            return;
        }

        const searchResult = await handleSearch();

        if (searchResult === 0) {
            Swal.fire({
                icon: "error",
                text: "ไม่มีข้อมูล",
                title: "เกิดข้อผิดพลาด"
            });
            return;
        }

        const url = `${process.env.NEXT_PUBLIC_BASE_URL}/depsummary?month=${month}&year=${year}`;
        window.open(url, '_blank');
    };


    const depmonthly = async () => {
        if (!month) {
            Swal.fire({
                icon: "error",
                text: "กรุณาเลือกเดือน",
                title: "ตารางสรุปเกิดข้อผิดพลาด"
            });
            return;
        }

        const searchResult = await handleSearch();

        if (searchResult === 0) {
            Swal.fire({
                icon: "error",
                text: "ไม่มีข้อมูล",
                title: "เกิดข้อผิดพลาด"
            });
            return;
        }

        const url = `${process.env.NEXT_PUBLIC_BASE_URL}/monthly?month=${month}&year=${year}`;
        window.open(url, '_blank');
    }

    return (
        <div className="flex-1 overflow-auto h-screen">
            <div className="card-header">รายการ AOTGA INAD</div>

            <div className="flex">
                <div className="flex w-1/2 justify-center items-center">
                    <span className="mt-5 mr-2">  รายงานแยกสายการบิน</span>

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
                            className="mt-7 w-20"
                            min={2024}
                            value={year}
                            onChange={(e) => setYear(parseInt(e.target.value))}
                        />
                    </div>
                    <div>
                        <button onClick={handleSearch} className="mt-7 bg-zinc-200 text-black">
                            <FaSearch /> รายการ
                        </button>
                    </div>
                </div>
                <div className="flex w-1/2 items-center">
                    <span className="mt-5 mr-2">  รายงานสรุปประจำเดือน(ทุกสายการบิน)</span>

                    <button onClick={viewdep} className="mt-7 bg-zinc-200 text-black">ตาราง Summary</button>
                    <button onClick={depmonthly} className="mt-7 bg-zinc-200 text-black">รายงานสรุป</button>
                </div>
            </div>
            <div className="text-center">* สามารถแสดงรายการทั้งหมดในเดือน-ปีที่ต้องการได้โดยไม่ต้องเลือกสายการบิน</div>
            <div className="flex">
                <button onClick={() => viewReport('Summary')} className="bg-yellow-300 text-black">
                    <FaEye className="mr-2" /> Summary
                </button>
                <button className="bg-green-600 text-white" onClick={() => viewReport('monthly')}>
                    <FaEye className="mr-2" /> View Report
                </button>
            </div>
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
                                <th className="px-4">Approved</th>
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
                                    <td className="px-2 border-gray-400 border border-collapse text-center">
                                        {item.Accept === 1 ? (
                                            <span className="inline-flex items-center px-3 py-1 text-sm font-medium text-green-100 bg-green-600 rounded-full"><FaCheckCircle className="mr-2" /> ตรวจแล้ว</span>
                                        ) : item.Accept === 0 ? (
                                            <span className="inline-flex items-center px-3 py-1 text-sm font-medium text-red-100 bg-red-600 rounded-full"><ImCross className="mr-2" /> ผิด</span>
                                        ) : null}
                                    </td>
                                    <td className="flex px-2 border-gray-400 border border-collapse justify-between items-center">
                                        <button onClick={() => editClick(item.id)}><FaEdit color="yellow" /> แก้ไข</button>
                                        <button onClick={() => deleted(item.id)}><FaTrash color="red" /> ลบ</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="text-center bg-red-500 p-4">ไม่พบข้อมูล</div>
                )}
            </div>

<<<<<<< HEAD
<Modal>
   
</Modal>

=======
            <Modal>
                {/* <EditRecord recordID={recordID} /> */}
            </Modal>
>>>>>>> develop
        </div>
    );
}

export default Page;

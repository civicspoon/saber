'use client';
import { getData } from "@/app/Utils/RequestHandle";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaEye, FaSearch } from "react-icons/fa";
import { FaPrint } from "react-icons/fa6";

function MonthDashboard() {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // getMonth() returns 0-11, so add 1 for 1-12
    const currentYear = currentDate.getFullYear();

    const [month, setMonth] = useState(currentMonth);
    const [year, setYear] = useState(currentYear);

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

    const router = useRouter();
    const [handleall, setHandleall] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const getHandle = async () => {
        setLoading(true);
        try {
            const response = await getData(`${process.env.NEXT_PUBLIC_API_URL}/inadhandling/departhandle/all?month=${month}&year=${year}`);
            setHandleall(response);
        } catch (error) {
            console.error("Error fetching data:", error);
            setError("There was an error fetching data. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            await getHandle();
        };
        fetchData();
    }, [month, year]);

    const viewdep = (depid, dep) => {
        router.push(`./Admin/ViewForCheck/${depid}/${dep}/${month}/${year}`);
    };

    return (
        <div className="flex flex-col items-center text-black">
            <div className="flex-1 w-full rounded-lg p-2 shadow-md">
                <div>
                    <div className="text-2xl font-semibold mb-4">รายการตรวจสอบ</div>
                    <div className="flex">
                        <div>
                            <select
                                value={month}
                                onChange={(e) => setMonth(parseInt(e.target.value))}
                                className="mt-7"
                            >
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
                            <button onClick={getHandle} className="mt-7 bg-zinc-200 text-black">
                                <FaSearch /> รายการ
                            </button>
                        </div>
                    </div>
                    {loading ? (
                        <div className="text-center">Loading...</div>
                    ) : error ? (
                        <div className="text-center text-red-500">{error}</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse border border-black">
                                <thead>
                                    <tr className="bg-blue-200">
                                        <th className="px-4 py-2">#</th>
                                        <th className="px-4 py-2">ท่าอากาศยาน</th>
                                        <th className="px-4 py-2">รายการ</th>
                                        <th className="px-4 py-2">ตรวจแล้ว</th>
                                        <th className="px-4 py-2">Accept</th>
                                        <th className="px-4 py-2">Reject</th>
                                        <th className="px-4 py-2">Nocheck</th>
                                        <th className="px-4 py-2">Detail</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {handleall.map((item, index) => (
                                        <tr key={index} className={(index % 2 === 0) ? "bg-gray-100" : "bg-white"}>
                                            <td className="px-4 py-2 text-center">{index + 1}</td>
                                            <td className="px-4 py-2 hover:text-blue-500" onClick={() => viewdep(item.depID, item.Name)} style={{ cursor: 'pointer' }}>{item.Name}</td>
                                            <td className="px-4 py-2 text-center">{item.inadCount}</td>
                                            <td className="px-4 py-2 text-center">{item.AcceptCount + item.RejectCount}</td>
                                            <td className="px-4 py-2 text-center">{item.AcceptCount}</td>
                                            <td className="px-4 py-2 text-center">{item.RejectCount}</td>
                                            <td className="px-4 py-2 text-center">{item.NocheckCount}</td>
                                            <td className="flex items-center justify-center py-2">
                                                <button className="hover:bg-blue-300" onClick={() => viewdep(item.depID, item.Name)}>
                                                    <FaEye className="mr-2" /> View
                                                </button>
                                           
                                                <button className="hover:bg-blue-300">
                                                    <FaPrint className="mr-2"  /> PreINV
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default MonthDashboard;

'use client'
import { getData } from "@/app/Utils/RequestHandle";
import { useEffect, useState } from "react";

function MonthDashboard() {
    const [handleall, setHandleall] = useState([]);
    const currentDate = new Date().toLocaleDateString('th-TH', {  year: 'numeric', month: 'long' });

    const getHandle = async () => {
        try {
            const response = await getData(`${process.env.NEXT_PUBLIC_API_URL}/inadhandling/departhandle/all`);
            setHandleall(response);
        } catch (error) {
            console.error("Error fetching data:", error);
            // Handle error gracefully (e.g., show error message to user)
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            await getHandle();
        };
        fetchData();
    }, []);

    return (
        <div className="flex flex-col items-center text-black">
            <div className="text-3xl font-semibold mb-4">Dashboard</div>
            <div className="w-full max-w-screen-lg rounded-lg p-4 shadow-md">
                <div className="">
                    <div className="text-2xl font-semibold mb-4">รายการตรวจสอบ {currentDate}</div>
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
                                </tr>
                            </thead>
                            <tbody>
                                {handleall.map((item, index) => (
                                    <tr key={index} className={(index % 2 === 0) ? "bg-gray-100" : "bg-white"}>
                                        <td className="px-4 py-2 text-center">{index + 1}</td>
                                        <td className="px-4 py-2">{item.Name}</td>
                                        <td className="px-4 py-2 text-center">{item.Flight}</td>
                                        <td className="px-4 py-2 text-center">{item.AcceptCount + item.RejectCount}</td>
                                        <td className="px-4 py-2 text-center">{item.AcceptCount}</td>
                                        <td className="px-4 py-2 text-center">{item.RejectCount}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>             
            </div>
        </div>
    );
}

export default MonthDashboard;
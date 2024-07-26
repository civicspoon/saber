'use client';
import { getData } from "@/app/Utils/RequestHandle";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function MonthDashboard() {
    const router = useRouter();
    const [handleall, setHandleall] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const currentDate = new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'long' });

    const getHandle = async () => {
        try {
            const response = await getData(`${process.env.NEXT_PUBLIC_API_URL}/inadhandling/departhandle/all`);
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
    }, []);

    const viewdep = (depid,dep) => {
        router.push(`./Admin/ViewForCheck/${depid}/${dep}`);
    };

    return (
        <div className="flex flex-col items-center text-black">
            <div className="w-full max-w-screen-lg rounded-lg p-2 shadow-md">
                <div>
                    <div className="text-2xl font-semibold mb-4">รายการตรวจสอบ {currentDate}</div>
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
                                    </tr>
                                </thead>
                                <tbody>
                                    {handleall.map((item, index) => (
                                        <tr 
                                            key={index} 
                                            className={(index % 2 === 0) ? "bg-gray-100" : "bg-white"} 
                                            onClick={() => viewdep(item.depID,item.Name)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <td className="px-4 py-2 text-center">{index + 1}</td>
                                            <td className="px-4 py-2">{item.Name}</td>
                                            <td className="px-4 py-2 text-center">{item.inadCount}</td>
                                            <td className="px-4 py-2 text-center">{item.AcceptCount + item.RejectCount}</td>
                                            <td className="px-4 py-2 text-center">{item.AcceptCount}</td>
                                            <td className="px-4 py-2 text-center">{item.RejectCount}</td>
                                            <td className="px-4 py-2 text-center">{item.NocheckCount}</td>
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

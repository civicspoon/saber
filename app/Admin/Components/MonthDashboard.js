'use client';
import Modal from "@/app/Components/Modal";
import { getData, postData } from "@/app/Utils/RequestHandle";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaEye, FaPlusCircle, FaRegSave, FaSave, FaSearch } from "react-icons/fa";
import { FaPencil, FaPrint } from "react-icons/fa6";
import Swal from "sweetalert2";

function MonthDashboard() {
    const baseurl = process.env.NEXT_PUBLIC_BASE_URL
    const currentDate = new Date();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const currentMonth = currentDate.getMonth() + 1; // getMonth() returns 0-11, so add 1 for 1-12
    const currentYear = currentDate.getFullYear();

    const [month, setMonth] = useState(currentMonth);
    const [year, setYear] = useState(currentYear);
    const [preinv, setPreinv] = useState({ depname: '', depid: '', month: '', year: '', preinvno: '' });

    const handlePreinvChange = (event) => {
        const value = event.target.value;
    
        // Ensure the value always starts with "PRE_IS-"
        let newValue = value;
        if (!newValue.startsWith("Pre_IS-")) {
            newValue = "Pre_IS-" + newValue;
        }
    
        setPreinv(prevState => ({
            ...prevState,
            preinvno: newValue
        }));
    };


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

    const openModal = (depname, depid) => {
        setPreinv({ depname, depid, month, year });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };


    const RegisterPreInv = async () => {
        try {
            const response = await postData(`${process.env.NEXT_PUBLIC_API_URL}/preinv/new`, preinv);

            // Check if the response indicates success
            if (response && response.status === 200) {
                // Show SweetAlert2 success message
                await Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: response.message,
                    confirmButtonText: 'OK'
                });

                // Close the modal
                closeModal();
                getHandle()
            } else {
                // Show SweetAlert2 error message if response is not successful
                await Swal.fire({
                    icon: 'error',
                    title: 'Oops!',
                    text: 'Something went wrong. Please try again.',
                    confirmButtonText: 'OK'
                });
            }
        } catch (error) {
            console.error('Error:', error);

            // Show SweetAlert2 error message for any exceptions
            await Swal.fire({
                icon: 'error',
                title: 'Oops!',
                text: 'An unexpected error occurred. Please try again.',
                confirmButtonText: 'OK'
            });
        }
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
                            <table className="table-auto w-full border-collapse border border-black">
                                <thead>
                                    <tr className="bg-blue-200">
                                        <th className="px-1 py-2">#</th>
                                        <th className="px-1 py-2">ท่าอากาศยาน</th>
                                        <th className="px-1 py-2">รายการ</th>
                                        <th className="px-1 py-2">ตรวจแล้ว</th>
                                        <th className="px-1 py-2">Accept</th>
                                        <th className="px-1 py-2">Reject</th>
                                        <th className="px-1 py-2">Nocheck</th>

                                        <th className="px-1 py-2">PreINV No.</th>
                                        <th className="px-1 py-2">Detail</th>
                                    </tr>
                                </thead>
                                <tbody    >
                                    {handleall.map((item, index) => (
                                        <tr key={index} className={(index % 2 === 0) ? "bg-gray-100" : "bg-white"}>
                                            <td className="px-1 py-2 text-center">{index + 1}</td>
                                            <td className="px-1 py-2 hover:text-blue-500" onClick={() => viewdep(item.depID, item.Name)} style={{ cursor: 'pointer' }}>
                                                {item.Name}
                                            </td>
                                            <td className="px-1 py-2 text-center">{item.inadCount}</td>
                                            <td className="px-1 py-2 text-center">{item.AcceptCount + item.RejectCount}</td>
                                            <td className="px-1 py-2 text-center">{item.AcceptCount}</td>
                                            <td className="px-1 py-2 text-center">{item.RejectCount}</td>
                                            <td className="px-1 py-2 text-center">{item.NocheckCount}</td>

                                            <td className="px-1 py-2  text-center">
                                                <div className="flex items-center justify-center space-x-2">
                                                    {item.INVNo !== "No INVNo" && (
                                                        <div className="ml-2">{item.INVNo}</div>
                                                    )}
                                                    <span className="hover:bg-blue-300 hover:rounded-md p-2 text-blue-600" onClick={() => openModal(item.Name, item.depID)}>

                                                        {item.INVNo !== "No INVNo" ? <FaPencil /> : <FaPlusCircle />}
                                                    </span>

                                                </div>
                                            </td>

                                            <td className="px-1 py-2 text-center">
                                                <div className="flex items-center justify-center space-x-2">
                                                    <span
                                                        className="hover:bg-blue-300 hover:rounded-md p-2 text-blue-600 cursor-pointer"
                                                        onClick={() => viewdep(item.depID, item.Name)}
                                                    >
                                                        <FaEye />
                                                    </span>
                                                    {item.INVNo !== "No INVNo" && (
                                                        <span
                                                            className="hover:bg-blue-300 hover:rounded-md p-2 text-blue-600 cursor-pointer"
                                                            onClick={() => window.open(`${baseurl}/monthly/preinvoice?invNo=${encodeURIComponent(item.INVNo)}`, '_blank')}
                                                        >
                                                            <FaPrint />
                                                        </span>
                                                    )}
                                                </div>
                                            </td>

                                        </tr>
                                    ))}
                                </tbody>



                            </table>
                        </div>


                    )}
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={closeModal}>
                <div className="flex-col">
                    <div className="bg-blue-200 text-xl p-4 rounded-2xl">
                        ลงทะเบียน Pre-Invoice
                        <div>{preinv.depname} {months[month - 1].label}-{year}</div>

                    </div>
                    <div className="mt-2">
                        <label>เลขที่ Pre-Invoice</label>
                        <input
                            type="text"
                            className="bg-white border shadow-lg ml-2 border-black"
                            value={preinv.preinvno}
                            onChange={handlePreinvChange}
                        />
                    </div>
                    <div>
                        <button className="w-11/12 bg-green-400 font-bold hover:bg-green-600" onClick={RegisterPreInv}>
                            <FaSave size={32} /> บันทึก
                        </button>
                    </div>
                    <div>

                    </div>
                </div>
            </Modal>
        </div>
    );
}

export default MonthDashboard;

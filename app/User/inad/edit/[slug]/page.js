"use client";
import { useEffect, useState } from "react";
import { FaPlusCircle, FaSave } from "react-icons/fa";
import Swal from "sweetalert2";
import { GetData, PostData, PutData } from "@/app/utils/Datahandling";

function Page({ params }) {
    const slug = params.slug;
    const userdata = JSON.parse(localStorage.getItem('userData'));

    const [flightlist, setFlightlist] = useState(null);
    const [formData, setFormData] = useState({
        timeIn: "",
        timeOut: "",
        flight: "",
        passengerName: "",
        remark: "",
    });

    const formatDateTimeLocal = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    useEffect(() => {
        if (slug) {
            fetchInadData(slug);
        }
        fetchFlightList();
    }, [slug]);

    const fetchInadData = async (slug) => {
        try {
            const response = await GetData(`${process.env.NEXT_PUBLIC_API_URL}inadhandling/${slug}`);
            if (response.status === 200) {
                const data = await response; // Parse response as JSON
                setFormData({
                    timeIn: formatDateTimeLocal(data.inad.TimeIn),
                    timeOut: formatDateTimeLocal(data.inad.TimeOut),
                    flight: data.inad.FlightID,
                    passengerName: data.inad.Passenger,
                    remark: data.inad.Remark,
                });
            } else {
                throw new Error('Failed to fetch Inad data');
            }
        } catch (error) {
            console.error('Error fetching Inad data:', error);
        }
    };

    const fetchFlightList = async () => {
        try {
            const flights = await GetData(`${process.env.NEXT_PUBLIC_API_URL}flight/flight/${userdata.DepartmentID}`);
            setFlightlist(flights);
        } catch (error) {
            console.error('Error fetching flight list:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (new Date(formData.timeIn) >= new Date(formData.timeOut)) {
            Swal.fire({
                icon: "error",
                title: "Invalid Time",
                text: "เวลาเข้า - ออกไม่ถูกต้อง ",
            });
            return;
        }

        try {
            const updatedInad = await PutData(`${process.env.NEXT_PUBLIC_API_URL}inadhandling/update/${slug}`, formData);
            console.log(updatedInad.status);
            if (updatedInad.status === 200) {
                Swal.fire({
                    title: "Record Updated",
                    text: "อัพเดทข้อมูลสำเร็จ",
                    icon: "success",
                    timer: 2000
                });

                // setFormData({
                //     timeIn: "",
                //     timeOut: "",
                //     flight: "",
                //     passengerName: "",
                //     remark: "",
                // });

                fetchFlightList();
            } else {
                throw new Error('Failed to update Inad record');
            }
        } catch (error) {
            console.error('Error updating Inad record:', error);
            Swal.fire({
                title: "ERROR",
                text: "เกิดข้อผิดพลาดในการอัพเดทข้อมูล",
                icon: "error",
            });
        }
    };



    return (
        <div className="flex-1">
            <div className="flex-row card text-black justify-center">
                <div className="card-header">แก้ไขรายการ INAD PAX</div>
                <form onSubmit={handleSubmit}>
                    <div className="flex">
                        <div className="w-3/6">
                            <div>เวลาเข้า</div>
                            <input
                                type="datetime-local"
                                name="timeIn"
                                value={formData.timeIn}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="w-3/6">
                            <div>เวลาออก</div>
                            <input
                                type="datetime-local"
                                name="timeOut"
                                value={formData.timeOut}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                    <div className="border-b-2 border-dotted border-gray-700 text-center">* หมายเหตุ AM ตั้งแต่เที่ยงคืนถึงเทียงวัน / PM ตั้งแต่เทียงวันถึงเทียงคืน *</div>
                    <div className="flex mt-4">
                        <div className="w-3/6">
                            <div>เลือกเทียวบิน</div>
                            <select
                                name="flight"
                                value={formData.flight}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Flight</option>
                                {flightlist && flightlist.map(flight => (
                                    <option key={flight.id} value={flight.id}>{flight.IATACode}{flight.FlightNo} - {flight.Route}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="flex">
                        <div className="w-3/6">
                            <input
                                type="text"
                                name="passengerName"
                                placeholder="Passenger Name"
                                value={formData.passengerName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="w-3/6">
                            <textarea
                                name="remark"
                                placeholder="Remark"
                                value={formData.remark}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <button type="submit" className="flex items-center text-2xl bg-blue-500 text-white p-2">
                            <FaSave className="mr-3" />
                            <span>บันทึก</span>
                        </button>
                    </div>
                </form>
            </div>

        </div>
    );
}

export default Page;

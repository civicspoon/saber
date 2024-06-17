"use client"
import { useEffect, useState } from "react";
import { FaBeer, FaPlusCircle, FaSave, FaThumbsUp } from "react-icons/fa";
import InadTodayHandle from "../components/InadTodayHandle";
import Swal from "sweetalert2";
import { GetData, PostData } from "@/app/utils/Datahandling";



function Page() {
    const userdata = JSON.parse(localStorage.getItem('userData'))
    console.log('====================================');
    console.log(userdata.DepartmentID);
    console.log('====================================');
    const [flightlist, setFlightlist] = useState(null)
    const [airlinelist, setAirlinelist] = useState(null)

    const [todayhandling, setTodayhandling] = useState(null)

    const [formData, setFormData] = useState({
        timeIn: "",
        timeOut: "",
        flight: "",
        passengerName: "",
        remark: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const fetchFlightList = async () => {
        try {
            const flights = await GetData(`${process.env.NEXT_PUBLIC_API_URL}flight/flight/${userdata.DepartmentID}`)
            setFlightlist(flights); // อัพเดท flightlist state ด้วยข้อมูลที่ได้
            console.log('Flights:', flights); // แสดงข้อมูลที่ได้ใน console
        } catch (error) {
            console.error('Error fetching flight list:', error);
        }
    };

    const fecthTodayHandling = async () =>{
        try {
            const todayhandle = await GetData(`${process.env.NEXT_PUBLIC_API_URL}inadhandling/todayhandling/${userdata.DepartmentID}`)
            setTodayhandling(todayhandle); // อัพเดท flightlist state ด้วยข้อมูลที่ได้
            console.log('Today handle:', todayhandle); // แสดงข้อมูลที่ได้ใน console
        } catch (error) {
            console.error('Error fetching flight list:', error);
        }
    }


    const fetchAirlineList = async () => {
        try {
            console.log('====================================');
            console.log("addflight");
            console.log('====================================');
            const airline = await GetData(`${process.env.NEXT_PUBLIC_API_URL}airline/airlinebydev/${userdata.DepartmentID}`)
            setAirlinelist(airline); // อัพเดท flightlist state ด้วยข้อมูลที่ได้
            console.log('airlines:', airline); // แสดงข้อมูลที่ได้ใน console
        } catch (error) {
            console.error('Error fetching flight list:', error);
        }
    };


    useEffect(() => {
        fecthTodayHandling();
        fetchFlightList(); // เรียกใช้ฟังก์ชัน fetchFlightList เมื่อ Component ถูก mount
    }, []);



    const addflight = async () => {
        try {
            // Fetch the airline list
            await fetchAirlineList();

            // Generate the options HTML string
            const airlineOptions = await airlinelist.map(airline =>
                `<option key=${airline.id} value=${airline.id}>${airline.Name} - ${airline.IATACode}</option>`
            ).join('');

            // Show SweetAlert2 modal
            Swal.fire({
                title: "เพิ่มเทียวบินกรณีไม่มีใน list",
                html: `
                    <select id='airline'>
                        <option value='' selected disabled>เลือกสายการบิน</option>
                        ${airlineOptions}
                    </select>
                <input type="text" id="flightNumber" placeholder="เลขเทียวบิน - ตัวเลขเท่านั้น" inputmode="numeric" pattern="[0-9]*" >
                    <input type="text" id="route" placeholder="เส้นทางบิน - Route" class="uppercase">
                `,
                showCloseButton: true,
                showCancelButton: true,
                focusConfirm: false,
                confirmButtonText: "บันทึก",
                cancelButtonText: "ยกเลิก",
                preConfirm: () => {
                    const airline = Swal.getPopup().querySelector('#airline').value;
                    const flightNumber = Swal.getPopup().querySelector('#flightNumber').value;
                    const route = Swal.getPopup().querySelector('#route').value;

                    if (!/^\d+$/.test(flightNumber)) {
                        Swal.showValidationMessage('กรุณากรอกเลขเทียวบินเป็นตัวเลขเท่านั้น');
                        return false;
                    }

                    if (!airline || !flightNumber || !route) {
                        Swal.showValidationMessage('กรุณากรอกข้อมูลให้ครบ');
                    }
                    return { airline, flightNumber, route };
                }
            }).then(async (result) => {
                if (result.isConfirmed) {
                    // Handle the new flight data here
                    const newflight = await PostData(`${process.env.NEXT_PUBLIC_API_URL}flight/newflight`, result.value)
                    if (newflight.status === 201) {
                        Swal.fire({
                            title: "New Record",
                            text: "เพิ่มข้อมูลสำเร็จ",
                            icon: "success",
                            timer: 2000
                        })
                        fetchFlightList()
                    } else {
                        Swal.fire({
                            title: "ERROR",
                            text: "เกิดข้อผิดพลาด",
                            icon: "error",
                        })
                    }

                    console.log('New flight data:', result.value);
                }
            });
        } catch (error) {
            console.error('Error adding flight:', error);
        }
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

        const newInad = await PostData(`${process.env.NEXT_PUBLIC_API_URL}inadhandling/new`, formData);
        if (newInad.status === 201) {
            Swal.fire({
                title: "New Record",
                text: "เพิ่มข้อมูลสำเร็จ",
                icon: "success",
                timer: 2000
            });
            fetchFlightList();
            fecthTodayHandling()
            setFormData({  // Clear the form data
                timeIn: "",
                timeOut: "",
                flight: "",
                passengerName: "",
                remark: "",
            });
        } else {
            Swal.fire({
                title: "ERROR",
                text: "เกิดข้อผิดพลาด",
                icon: "error",
            });
        }
    };


    return (
        <>
            <div className="flex-row card text-black justify-center">
                <div className="card-header">เพิ่มรายการ INAD PAX</div>
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
                        <div className="w-3/6">
                            <button onClick={addflight} type="button" className="flex shadow-md bg-yellow-200 w-10/12 justify-center items-center">
                                <FaPlusCircle className="mr-2" /> เพิ่มเทียวบินกรณีไม่พบ
                            </button>
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
                                className="uppercase"
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

            <InadTodayHandle todayhandle={todayhandling} />
        </>
    );
}

export default Page;

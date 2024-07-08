"use client";
import DateTimePicker from "@/app/Components/DateTimePicker";
import { useEffect, useState } from "react";
import AirlineSelect from "../../../Components/AirlineSelect";
import FlightSelect from "../../../Components/FlightSelect";
import { useRouter } from "next/navigation";
import { getData } from "@/app/Utils/RequestHandle";

function Page({ params }) {
    const router = useRouter();
    const [inadid, setInadid] = useState('');
    const [fullstartdate, setFullstartdate] = useState('');
    const [fullenddate, setFullenddate] = useState('');
    const [userData, setUserData] = useState({});
    const [selectedFlight, setSelectedFlight] = useState("");
    const [selectedAirline, setSelectedAirline] = useState("");
    const [timeok, setTimeok] = useState(false);
    const [title, setTitle] = useState('');
    const [checkboxdisable, setCheckboxdisable] = useState(false);
    const [remarkval, setRemarkval] = useState('');
    const [surname, setSurname] = useState('');
    const [midname, setMidname] = useState('');
    const [passenger, setPassenger] = useState('');
    const [disableRemark, setDisableRemark] = useState(false);
    const [outbound, setOutbound] = useState('');
    const [outboundflight, setOutboundflight] = useState('');
    const [outbounddate, setOutbounddate] = useState('');
    const [initialData, setInitialData] = useState(null);

    const months = [
        'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
        'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
    ];

    const [startDateTime, setStartDateTime] = useState({
        date: '',
        month: '',
        year: '',
        hour: '',
        minute: ''
    });

    const [endDateTime, setEndDateTime] = useState({
        date: '',
        month: '',
        year: '',
        hour: '',
        minute: ''
    });

    useEffect(() => {
        if (params.slug) {
            setInadid(params.slug);
        }
    }, [params.slug]);

    useEffect(() => {
        if (inadid) {
            const getInitData = async () => {
                try {
                    const response = await getData(`${process.env.NEXT_PUBLIC_API_URL}/inadhandling/${inadid}`);
                    setInitialData(response.inad);
                    // Example: setMidname(response.inad.MidName)
                    setPassenger(response.inad.Passenger)


                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            };
            getInitData();
        }
    }, [inadid]);

    const handleDateTimeChange = (newDateTime) => {
        setStartDateTime(newDateTime);
    };

    const handleEndDateTimeChange = (newDateTime) => {
        setEndDateTime(newDateTime);
    };

    const handleAirlineSelect = (selectedValue) => {
        setSelectedAirline(selectedValue);
    };

    const handleFlightSelect = (selectedValue) => {
        setSelectedFlight(selectedValue);
    };


const getflight =async ()=>{
    const response = await getData(`${process.env.NEXT_PUBLIC_API_URL}/flight/${selectedFlight}`);
}

    return (
        <>
            <div className="cardheader">แก้ไข</div>
            <div className="flex bg-slate-700 p-4 rounded-lg shadow-lg">
                <div>
                    เริ่มเวลา <span>{startDateTime.date}-{startDateTime.month}-{startDateTime.year} {startDateTime.hour}:{startDateTime.minute}</span>
                    <div>แก้ไข</div>
                    <DateTimePicker Label='เริ่มวันที่ / เวลา' initialDateTime={startDateTime} onDateTimeChange={handleDateTimeChange} />
                </div>
                <div>
                    สิ้นสุดเวลา <span>{endDateTime.date}-{endDateTime.month}-{endDateTime.year} {endDateTime.hour}:{endDateTime.minute}</span>
                    <div>แก้ไข</div>
                    <DateTimePicker Label='สิ้นสุดวันที่ / เวลา' initialDateTime={endDateTime} onDateTimeChange={handleEndDateTimeChange} />
                </div>
                <div>
                    <div>ชื่อผู้โดยสาร</div>
                    <div>
                        <label>
                            PASSENGER 
                            <input
                                type="text"
                                // placeholder="LastName / Familyname / Surename"
                                className="uppercase w-96"
                                value={passenger}
                                onChange={(e) => setSurname(e.target.value)}
                            />
                        </label>
                     
                    </div>
                </div>
                <div className="ml-2">
                    <AirlineSelect onAirlineSelect={handleAirlineSelect} />
                    <FlightSelect selectedAirline={selectedAirline} onChange={handleFlightSelect} />
                </div>
                <div className="flex flex-wrap items-center justify-center text-center md:text-left" hidden={checkboxdisable}>
                    <div className="flex sm:flex-row items-center sm:ml-2 mt-2">
                        <div className="mr-2" >เทียวบินออก</div>
                        <input
                            type="text"
                            placeholder="ตัวอย่าง ID1234"
                            className="uppercase sm:w-32"
                            
                            value={outbound}
                            onChange={(e) => setOutbound(e.target.value)}
                        />
                    </div>
                    <div>
                        <div className="mr-2" >เส้นทางบิน</div>
                        <input
                            type="text"
                            placeholder="ตัวอย่าง BKK/HKT"
                            className="uppercase sm:w-32"
                            
                            value={outboundflight}
                            onChange={(e) => setOutboundflight(e.target.value)}
                        />
                    </div>
                    <div className="flex sm:flex-row items-center sm:ml-2 mt-2">
                        <div className="mr-2" >วันที่</div>
                        <input
                            type="date"
                            className="uppercase sm:w-32"
                            
                            value={outbounddate}
                            onChange={(e) => setOutbounddate(e.target.value)}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}

export default Page;

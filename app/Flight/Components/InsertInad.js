'use client';
import { useEffect, useState } from "react";
import DateTimePicker from "../../Components/DateTimePicker";
import Swal from "sweetalert2";
import FlightSelect from "./FlightSelect";
import AirlineSelect from "./AirlineSelect";
import { FaSave } from "react-icons/fa";
import { postData } from "@/app/Utils/RequestHandle";
import { formatDate } from "@/app/Utils/DateTime";

function InsertInad() {
    const months = [
        'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
        'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
    ];
const [handleByAirlines, setHandleByAirlines] = useState(false);

    const [fullstartdate, setFullstartdate] = useState('');
    const [fullenddate, setFullenddate] = useState('');
    const [userData, setUserData] = useState();
    const [selectedFlight, setSelectedFlight] = useState("");
    const [selectedAirline, setSelectedAirline] = useState("");
    const [timeok, setTimeok] = useState(false);
    const [title, setTitle] = useState('');
    const [checkboxdisable, setCheckboxdisable] = useState(false);
    const [remarkval, setRemarkval] = useState('');
    const [surname, setSurname] = useState('');
    const [midname, setMidname] = useState('');
    const [firstname, setFirstname] = useState('');

    const [disableRemark, setDisableRemark] = useState(false);
    const [outbound, setOutbound] = useState('');
    const [outboundflight, setOutboundflight] = useState('');
    const [outbounddate, setOutbounddate] = useState('');
    let tmpmidname = ''

    const [startDateTime, setStartDateTime] = useState({
        date: '',
        month: '',
        year: '',
        hour: '',
        minute: ''
    });

    useEffect(() => {
        setRemarkval(`OUTBOUND ${outbound} ${outboundflight} ON ${formatDate(outbounddate)}`)
    }, [outbound, outboundflight, outbounddate])

    useEffect(() => {
        setRemarkval('PASSENGER IS ALLOWED');
    }, [checkboxdisable])

    const handleCheckbox = () => {
        setDisableRemark(!disableRemark);
        setCheckboxdisable(!checkboxdisable);

    };


    const [endDateTime, setEndDateTime] = useState({
        date: '',
        month: '',
        year: '',
        hour: '',
        minute: ''
    });

    useEffect(() => {
        const userData = sessionStorage.getItem('usdt');
        if (userData) {
            setUserData(JSON.parse(userData));
        }
    }, []);

    useEffect(() => {
        if (startDateTime.date) {
            const mindex = months.indexOf(startDateTime.month) + 1;
            const formattedDate = `${startDateTime.year}-${mindex}-${startDateTime.date} ${startDateTime.hour}:${startDateTime.minute}`;
            setFullstartdate(formattedDate);
        }
    }, [startDateTime, months]);

    useEffect(() => {
        if (endDateTime.date) {
            const mindex = months.indexOf(endDateTime.month) + 1;
            const formattedDate = `${endDateTime.year}-${mindex}-${endDateTime.date} ${endDateTime.hour}:${endDateTime.minute}`;
            setFullenddate(formattedDate);
        }
    }, [endDateTime, months]);

    useEffect(() => {
        // Check if both start and end dates are provided
     
            // If both dates are present and start date is less than or equal to end date
            setTimeok(true);
        
        
    }, [ fullenddate]);
    

    const handleStartDateTimeChange = (newDateTime) => {
        setStartDateTime(newDateTime);
    };

    const handleEndDateTimeChange = (newDateTime) => {
        setEndDateTime(newDateTime);
    };

    const handleAirlineSelect = (selectedValue) => {
        setSelectedAirline(selectedValue);
        console.log("Selected Airline:", selectedValue);
    };

    const handleFlightSelect = (selectedValue) => {
        setSelectedFlight(selectedValue);
    };

    useEffect(() => {
        console.log("Selected Flight:", selectedFlight);
    }, [selectedFlight]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!validateForm()) return;

        const data = {
            timeIn: fullstartdate,
            timeOut: fullenddate,
            flight: selectedFlight,
            remark: remarkval.toUpperCase(),
            passengerName: surname.toLocaleUpperCase() + '/' + tmpmidname + firstname.toUpperCase() + ':' + title.toUpperCase(),
            UserID: userData.EmID,
        };

        console.log(data);
        const response = await postData(`${process.env.NEXT_PUBLIC_API_URL}/inadhandling/new`, data);

        if (response.status === 201) {
            Swal.fire({
                icon: "success",
                title: "Success",
                text: "Data submitted successfully."
            });
            document.getElementById("inadform").reset();
            console.log('====================================');
            console.log('resetform');
            console.log('====================================');
            clearForm();
        }
    };

    const validateForm = () => {
        if (!midname) {
            tmpmidname = ''
        } else {
            tmpmidname = midname.toLocaleUpperCase() + ' '
        }
        if (
            !fullstartdate ||
            !fullenddate ||
            !title ||
            !selectedFlight ||
            !remarkval ||
            !firstname ||
            !surname
        ) {
            Swal.fire({
                icon: "warning",
                title: "Validation Error",
                text: "Please fill in all the required fields."
            });
            return false;
        }
        return true;
    };

    const clearForm = () => {
        setFullstartdate('');
        setFullenddate('');
        setSelectedFlight('');
        setSelectedAirline('');
        setTimeok(false);
        setTitle('');
        setCheckboxdisable(false);
        setRemarkval('');
        setSurname('');
        setMidname('');
        setFirstname('');
        setDisableRemark(false);
        setOutbound('');
        setOutboundflight('');
        setOutbounddate('');
        setStartDateTime({
            date: '',
            month: '',
            year: '',
            hour: '',
            minute: ''
        });
        setEndDateTime({
            date: '',
            month: '',
            year: '',
            hour: '',
            minute: ''
        });
    };

    return (
        <div>
            <form id="inadform" className="flex flex-wrap items-start justify-center text-center md:text-left" onSubmit={handleSubmit}>
                <div className="flex flex-wrap p-1">
                    <div>
                        <DateTimePicker Label='เริ่มวันที่ / เวลา' initialDateTime={fullstartdate} onDateTimeChange={handleStartDateTimeChange} />
                    </div>
                    <div>{startDateTime.date && (
                        <DateTimePicker Label='ถึงวันที่ / เวลา' initialDateTime={fullenddate} onDateTimeChange={handleEndDateTimeChange} />
                    )}</div>
                </div>
                {timeok && (
                    <div>
                        <div>ชื่อผู้โดยสาร</div>
                        <div>
                            <div>
                                <label>LastName / Familyname / Surename
                                    <input
                                        type="text"
                                        placeholder="LastName / Familyname / Surename"
                                        className="uppercase"
                                        value={surname}
                                        onChange={(e) => setSurname(e.target.value)}
                                    />
                                </label>
                            </div>
                            <div>
                                <label>Middle Name / Second  Name
                                    <input type="text"
                                        placeholder="Middle Name / Second  Name"
                                        className="uppercase"
                                        value={midname}
                                        onChange={(e) => setMidname(e.target.value)}
                                    />
                                </label>
                            </div>
                            <div>
                                <label>Name / Given Name / First Name
                                    <input type="text"
                                        placeholder="Name / Given Name / First Name"
                                        className="uppercase"
                                        value={firstname}
                                        onChange={(e) => setFirstname(e.target.value)}
                                    />
                                </label>
                            </div>
                            <div>
                                <label>คำนำหน้าชื่อ
                                    <select id="title" name="title" value={title} onChange={(e) => setTitle(e.target.value)}>
                                        <option value="">กรุณาเลือก</option>
                                        <option value="Mr.">Mr.</option>
                                        <option value="Mrs.">Mrs.</option>
                                        <option value="Miss">Miss</option>
                                        <option value="Ms.">Ms.</option>
                                        <option value="Dr.">Dr.</option>
                                        <option value="Prof.">Prof.</option>
                                        <option value="Rev.">Rev.</option>
                                    </select>
                                </label>
                            </div>
                        </div>
                    </div>
                )}
                {title && (
                    <div className="ml-2">
                        <AirlineSelect onAirlineSelect={handleAirlineSelect} />
                        {selectedAirline && <FlightSelect selectedAirline={selectedAirline} onChange={handleFlightSelect} />}
                    </div>
                )}
                {selectedFlight && (
                    <>
                        <div className="flex flex-wrap ml-2">
                            <div className="flex items-center">
                                <input
                                    onChange={handleCheckbox}
                                    className="w-7 h-7 rounded focus:ring-2 focus:ring-blue-600"
                                    type="checkbox"
                                    checked={checkboxdisable}
                                />
                                <label className="ml-2">ผู้โดยสารได้รับอนุญาตเข้าประเทศ</label>
                            </div>
                            <div className="flex flex-wrap items-center justify-center text-center md:text-left" hidden={checkboxdisable}>
                                <div className="flex flex-col w-full sm:w-auto sm:flex-row items-center sm:ml-2 mt-2">
                                    <div className="flex flex-col sm:flex-row items-center sm:ml-2 mt-2">
                                        <div className="mr-2" hidden={disableRemark}>เทียวบินออก</div>
                                        <input
                                            type="text"
                                            placeholder="ตัวอย่าง ID1234"
                                            className="uppercase sm:w-32"
                                            hidden={disableRemark}
                                            value={outbound}
                                            onChange={(e) => setOutbound(e.target.value)}
                                        />
                                    </div>
                                    <div className="flex flex-col sm:flex-row items-center sm:ml-2 mt-2">
                                        <div className="mr-2" hidden={disableRemark}>เส้นทางบิน</div>
                                        <input
                                            type="text"
                                            placeholder="ตัวอย่าง BKK/HKT"
                                            className="uppercase sm:w-32"
                                            hidden={disableRemark}
                                            value={outboundflight}
                                            onChange={(e) => setOutboundflight(e.target.value)}
                                        />
                                    </div>
                                    <div className="flex flex-col sm:flex-row items-center sm:ml-2 mt-2">
                                        <div className="mr-2" hidden={disableRemark}>วันที่</div>
                                        <input
                                            type="date"
                                            className="uppercase sm:w-32"
                                            hidden={disableRemark}
                                            value={outbounddate}
                                            onChange={(e) => setOutbounddate(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4">
                            <button type="submit" className="bg-green-600 w-full sm:w-60 h-16 flex items-center justify-center">
                                <FaSave size={30} className="mr-2" />
                                บันทึก
                            </button>
                        </div>
                    </>
                )}
            </form>
        </div>
    );
}

export default InsertInad;

"use client"
import { useEffect, useState } from "react";
import DateTimePicker from "../Components/DateTimePicker";
import Swal from "sweetalert2";
import { DateDiff } from "../Utils/DateTime";

function Page() {
    const months = [
        'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
        'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
    ];

    const [fullstartdate, setFullstartdate] = useState('');
    const [fullenddate, setFullenddate] = useState('');
    const [timeok, setTimeok] = useState('');

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
        const mindex = months.indexOf(startDateTime.month) + 1;
        const formattedDate = `${startDateTime.year}-${mindex}-${startDateTime.date} ${startDateTime.hour}:${startDateTime.minute}`;
        setFullstartdate(formattedDate);
    }, [startDateTime, months]);

    useEffect(() => {
        const mindex = months.indexOf(endDateTime.month) + 1;
        const formattedDate = `${endDateTime.year}-${mindex}-${endDateTime.date} ${endDateTime.hour}:${endDateTime.minute}`;
        setFullenddate(formattedDate);
    }, [endDateTime, months]);

    useEffect(() => {
        // Log the fullstartdate whenever it changes
        console.log('====================================');
        console.log(fullstartdate);
        console.log('====================================');
    }, [fullstartdate]);

    useEffect(() => {
        // Log the fullenddate whenever it changes
        console.log('====================================');
        console.log(fullstartdate, ' ', fullenddate);
        console.log('====================================');
        if (fullstartdate >= fullenddate) {
            if (fullstartdate >= fullenddate && endDateTime.date !== '') {
                Swal.fire({
                    icon: "error",
                    title: "ERROR",
                    text: "เวลาเริ่มเท่ากับหรือน้อยกว่าสิ้นสุด"
                })
            }
        } else {
            setTimeok(true)
        }

    }, [fullenddate]);

    useEffect(() => {
        // สมมุติว่าข้อมูลจากฐานข้อมูล
        const fetchedData = {
            date: '',
            month: '',
            year: '',
            hour: '',
            minute: ''
        };
        setStartDateTime(fetchedData);
        setEndDateTime(fetchedData);
    }, []);


    //  compare enddate 


    const handleStartDateTimeChange = (newDateTime) => {
        setStartDateTime(newDateTime);
    };

    const handleEndDateTimeChange = (newDateTime) => {
        setEndDateTime(newDateTime);
    };



    return (
        <div className="flex">
            <div className="p-1">
                <DateTimePicker Label='เริ่มวันที่ / เวลา' initialDateTime={fullstartdate} onDateTimeChange={handleStartDateTimeChange} />
            </div>
            {startDateTime.date && (
                <div className="p-1">
                    <DateTimePicker Label='ถึงวันที่ / เวลา' initialDateTime={fullenddate} onDateTimeChange={handleEndDateTimeChange} />
              
                </div>
            )
            }

            {timeok &&
                (
                    <div>
                        <div>ชื่อผู้โดยสาร</div>
                        <div>
                            <select id="title" name="title">
                                <option value="">กรุณาเลือก</option>
                                <option value="Mr.">Mr.</option>
                                <option value="Mrs.">Mrs.</option>
                                <option value="Miss">Miss</option>
                                <option value="Ms.">Ms.</option>
                                <option value="Dr.">Dr.</option>
                                <option value="Prof.">Prof.</option>
                                <option value="Rev.">Rev.</option>
                            </select>
                            <input
                                type="text"
                                placeholder="LastName / Familyname / Surename"
                                className="uppercase"
                            />
                            <input
                                type="text"
                                placeholder="Middle Name / Second  Name "
                                className="uppercase"
                            />
                            <input
                                type="text"
                                placeholder="Name / Given Name / First Name"
                                className="uppercase"
                            />
                        </div>
                    </div>
                )}


        </div>
    );
}

export default Page;

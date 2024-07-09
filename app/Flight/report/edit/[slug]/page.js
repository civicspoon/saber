'use client'

import DateTimePicker from "@/app/Components/DateTimePicker";
import { getData } from "@/app/Utils/RequestHandle";
import { useEffect, useState } from "react";

function Page({ params }) {
    // Variables
    const [initdata, setInitdata] = useState({});
    const [timein, setTimein] = useState({ date: '', month: '', year: '', hour: '', minute: '' });

    // Effect
    useEffect(() => {
        getInitdata();
    }, [params.slug]);

    // Function
    const getInitdata = async () => {
        const response = await getData(`${process.env.NEXT_PUBLIC_API_URL}/inadhandling/${params.slug}`);
        setInitdata(response.inad);

        // Parse TimeIn
        const timeInDate = new Date(response.inad.TimeIn);
        const formattedTimeIn = {
            date: timeInDate.getDate().toString().padStart(2, '0'),
            month: timeInDate.toLocaleString('th-TH', { month: 'long' }),
            year: timeInDate.getFullYear().toString(),
            hour: timeInDate.getHours().toString().padStart(2, '0'),
            minute: timeInDate.getMinutes().toString().padStart(2, '0')
        };

        setTimein(formattedTimeIn);
    };

    const handleDateTimeChange = (newDateTime) => {
        console.log('Selected DateTime:', newDateTime);
        // Update timein or initdata as needed
    };

    return (
        <div>
            {initdata.TimeIn && (
                <>
                {`${timein.date}-${timein.month}-${timein.year}`}
                <DateTimePicker
                    Label="แก้ไขเวลาเริ่ม"
                    initialDateTime={timein}
                    onDateTimeChange={handleDateTimeChange}
                />
                </>
            )}
        </div>
    );
}

export default Page;

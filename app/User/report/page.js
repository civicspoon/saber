'use client'
import { GetData } from "@/app/utils/Datahandling";
import { useEffect, useState } from "react";
import { FaTable } from "react-icons/fa";
import { FaMagnifyingGlass } from "react-icons/fa6";
import Swal from "sweetalert2";
import { BsLayoutTextWindowReverse } from "react-icons/bs";

function Page() {
    const userdata = JSON.parse(localStorage.getItem('userData'));
    const depid = userdata.DepartmentID;

    const monthsThai = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];

    const [airlineList, setAirlineList] = useState([]);
    const [monthList, setMonthList] = useState(monthsThai);
    const [yearList, setYearList] = useState([]);
    const [selectedAirline, setSelectedAirline] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [buttonshow, setButtonshow] = useState(false);
    const [reportdata, setReportdata] = useState(null);

    const fetchAirline = async () => {
        const airline = await GetData(`${process.env.NEXT_PUBLIC_API_URL}airline/airlinebydev/${depid}`);
        setAirlineList(airline);
    };

    const fetchYear = async () => {
        const year = await GetData(`${process.env.NEXT_PUBLIC_API_URL}inadhandling/year/${depid}`);
        setYearList(year);
    };

    const handleSearch = async () => {
        if (selectedAirline && selectedMonth && selectedYear) {
            const result = await GetData(`${process.env.NEXT_PUBLIC_API_URL}inadhandling/getmonthlyreport/${selectedAirline}/${selectedMonth}/${selectedYear}`);
            // Handle the result as needed, for example, update state to display the result

            if (result.length === 0) {
                Swal.fire({
                    icon: "info",
                    title: "Not Found",
                    text: "ไม่พบข้อมูล"
                });
                setButtonshow(false);
                setReportdata(result);
            } else {
                setButtonshow(true);
                setReportdata(result);
            }
        } else {
            Swal.fire({
                icon: "warning",
                title: "Missing Data",
                text: "กรุณาเลือกข้อมูลให้ครบทุกช่อง"
            });
        }
    };

    useEffect(() => {
        fetchAirline();
        fetchYear();
    }, []);

    const handleViewMonthly = (val,e) => {
        e.preventDefault()
        const queryString = new URLSearchParams({
            airline: selectedAirline,
            month: selectedMonth,
            year: selectedYear
        }).toString();
        window.open(`/report/${val}?${queryString}`, '_blank');
    };

    return (
        <div className="flex-1">
            <div className="card-header">ค้นหารายงาน</div>
            <div className="flex card justify-between items-center">
                <div className="w-1/4">
                    สายการบิน
                    <select value={selectedAirline} onChange={(e) => setSelectedAirline(e.target.value)}>
                        <option value="" disabled>กรุณาเลือกสายการบิน</option>
                        {airlineList && airlineList.map((airline, index) => (
                            <option key={index} value={airline.id}>{airline.Name}</option>
                        ))}
                    </select>
                </div>
                <div className="w-1/4">
                    <div>เดือน</div>
                    <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
                        <option value="" disabled>กรุณาเลือกเดือน</option>
                        {monthList && monthList.map((month, index) => (
                            <option key={index} value={index + 1}>{month}</option> // index + 1 เพื่อให้ตรงกับค่าเดือนในฐานข้อมูล
                        ))}
                    </select>
                </div>
                <div className="w-1/4">
                    <div>ปี</div>
                    <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                        <option value="" disabled>กรุณาเลือกปี</option>
                        {yearList && yearList.map((year, index) => (
                            <option key={index} value={year.Year}>{year.Year}</option>
                        ))}
                    </select>
                </div>
                <div className="flex w-1/4 justify-center items-center">
                    <button className="flex w-11/12 bg-blue-600 text-white items-center justify-center" onClick={handleSearch}><FaMagnifyingGlass /> ค้นหา</button>
                </div>
            </div>

            {buttonshow && (
                <div className="mt-4 flex justify-between">
                    <button className="flex text-center justify-center items-center bg-green-500 text-white py-2 px-4 rounded w-1/2" onClick={(e) => handleViewMonthly('summary',e)}><FaTable className="mr-2" size={35} /> View Summary</button>
                    <button className="flex text-center justify-center items-center bg-green-500 text-white py-2 px-4 rounded w-1/2" onClick={(e) => handleViewMonthly('monthly',e)}><BsLayoutTextWindowReverse size={35} className="mr-2"/>View Monthly</button>
                </div>
            )}
        </div>
    );
}

export default Page;

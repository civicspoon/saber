'use client';
import { DeleteData, GetData } from "@/app/utils/Datahandling";
import { HHMM } from "@/app/utils/DateTimeConversion";
import { useEffect, useState } from "react";
import { FaPencilAlt, FaTrashAlt } from "react-icons/fa";
import Swal from "sweetalert2";
import { useRouter } from 'next/navigation';

function Page() {
    const router = useRouter();

    const userdata = JSON.parse(localStorage.getItem('userData'));
    const depid = userdata.DepartmentID;
    const monthsThai = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];
    const [handlinglist, setHandlinglist] = useState([])
    const [airlineList, setAirlineList] = useState([]);
    const [flightList, setFlightList] = useState([]);
    const [filters, setFilters] = useState({
        airline: '',
        flight: '',
        startDate: '',
        endDate: '',
        page: 1,
        limit: 10
    });


    // Fetch Airlines
    const fetchAirline = async () => {
        const airline = await GetData(`${process.env.NEXT_PUBLIC_API_URL}airline/airlinebydev/${depid}`);
        setAirlineList(airline);
    };

    // Fetch Flights
    const fetchFlight = async (airlineId) => {
        if (airlineId) {
            const flights = await GetData(`${process.env.NEXT_PUBLIC_API_URL}flight/airlineflight/${airlineId}`);
            setFlightList(flights);
        }
    };

    // Fetch INAD Reports
    const fetchINADReports = async () => {
        const reports = await GetData(`${process.env.NEXT_PUBLIC_API_URL}flight/inadreport/${filters.flight}/${filters.startDate}/${filters.endDate}/${filters.page}`);
        setHandlinglist(reports);
    console.log('INAD Is reports an array?', Array.isArray(reports));
    };

    useEffect(() => {
        fetchAirline();
    }, []);

    useEffect(() => {
        if (filters.airline) {
            fetchFlight(filters.airline);
        }
    }, [filters.airline]);

    const handleSelectChange = (event) => {
        const { name, value } = event.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };



    const handleSearch = (event) => {
        event.preventDefault();
        setFilters(prev => ({ ...prev, page: 1 })); // Reset to first page on new search
        fetchINADReports();
        console.log('====================================');
        console.log(filters);
        console.log('====================================');

        handleReset()
    };

    const handleReset = () => {
        setFilters({
            airline: '',
            flight: '',
            startDate: '',
            endDate: '',
            page: 1,
            limit: 10
        });
        // setFlightList([]);
    };

    const handleEdit = (slug) => {
        router.push(`./inad/edit/${slug}`);
    };


    
    const handleDelete = async (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await DeleteData(`${process.env.NEXT_PUBLIC_API_URL}inadhandling/delete/${id}`);
                    if (response.status === 200) {
                        Swal.fire(
                            'Deleted!',
                            'The record has been deleted.',
                            'success'
                        );
                        fetchINADReports(); // Refresh the list after deletion
                    } else {
                        throw new Error('Failed to delete record');
                    }
                } catch (error) {
                    console.error('Error deleting record:', error);
                    Swal.fire({
                        title: 'Error!',
                        text: 'Failed to delete the record.',
                        icon: 'error'
                    });
                }
            }
        });
    };

    return (
        <div className="flex w-full">
            <div className="card w-full">
                <div className="card-header">
                    รายงาน INAD
                </div>
                <div>
                    <table className="m-auto w-full text-sm">
                        <thead className=" shadow-md bg-blue-200">
                            <tr>
                                <th className='th'>#</th>
                                <th className='th'>Date</th>
                                <th className='th'>Flight No</th>
                                <th className='th'>TimeIn / TimeOut</th>
                                <th className='th'>Hour</th>
                                <th className='th'>Passenger</th>
                                <th className='th'>Remark</th>
                                <th className='th'>Action</th>
                            </tr>
                        </thead>
                        <tbody className="th text-center bg-yellow-50 round-b-lg`">
                            {handlinglist && handlinglist.map((handle, index) => (
                                <tr key={handle.inadID}>
                                    <td className="td ">{index + 1}</td>
                                    <td className="td">{handle.date}</td>
                                    <td className="td">{handle.IATACode}{handle.FlightNo}</td>
                                    <td className="td text-start">Time IN : {HHMM(handle.TimeIn)}<br/>Time OUT : {HHMM(handle.TimeOut)}</td>
                                    <td className="td">{handle.time_difference.slice(0, -3)}</td>
                                    <td className="td">{handle.Passenger}</td>
                                    <td className="td">{handle.Remark}</td>
                                    <td className="flex items-center text-center justify-center">
                                    <button
                                            className="shadow-md p-3 m-1 rounded-md bg-blue-600 text-white"
                                            onClick={() => handleEdit(handle.inadID)}
                                        >
                                            <FaPencilAlt />
                                        </button>                                     
                                        <button
                                            className="shadow-md p-3 m-1 rounded-md bg-red-600 text-white"
                                            onClick={() => handleDelete(handle.inadID)}
                                        >
                                            <FaTrashAlt />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>

                    </table>
                </div>
            </div>

            <div className="w-3/12 card h-auto">
                <form onSubmit={handleSearch}>
                    <div className="card-header">
                        ค้นหารายงาน INAD
                    </div>
                    <div>
                        <div>สายการบิน</div>
                        <select name="airline" value={filters.airline} onChange={handleSelectChange}>
                            <option value="" selected disabled>กรุณาเลือกสายการบิน</option>
                            {airlineList && airlineList.map((airline, index) => (
                                <option key={index} value={airline.id}>{airline.Name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <div>เที่ยวบิน</div>
                        <select name="flight" value={filters.flight} onChange={handleSelectChange}>
                            <option value="" selected disabled>กรุณาเลือกเที่ยวบิน</option>
                            {flightList && flightList.map((flight, index) => (
                                <option key={index} value={flight.id}>{flight.IATACode}{flight.FlightNo}  {flight.Route}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <div>วันที่</div>
                        <input type="date" name="startDate" value={filters.startDate} onChange={handleSelectChange} />
                        <div>ถึงวันที่</div>
                        <input type="date" name="endDate" value={filters.endDate} onChange={handleSelectChange} />
                    </div>
                    <button type="submit" className="bg-blue-600 text-white">ค้นหา</button>
                  
                </form>  <button type="button" className="bg-yellow-500 text-white" onClick={handleReset}>ล้างการค้นหา</button>
            </div>
        </div>
    );
}

export default Page;

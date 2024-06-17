import React from 'react';
import {FaEdit ,FaMinusCircle} from 'react-icons/fa';

function InadTodayHandle({ todayhandle }) {
    const shortDaysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const shortMonths = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

    const currentDate = new Date();
    const formattedDate = `${currentDate.getDate()}-${shortMonths[currentDate.getMonth()]}-${currentDate.getFullYear()}`;

    function removeSecondsFromTimeDiff(timeDiff) {
        return timeDiff.split(':').slice(0, 2).join(':');
    }

    return (
        <div className="flex-row card text-black justify-center">
            <div className="card-header">รายการ INAD PAX ประจำวัน {formattedDate}</div>
            <div className="flex justify-center">
                <table className='table w-11/12'>
                    <thead className='bg-gray-400 text-white rounded-md'>
                        <tr>
                            <th className='w-10'>NO.</th>
                            <th>Flight</th>
                            {/* <th className='md:block'>Route</th> */}
                            {/* <th>Pax</th> */}
                            <th>Time In</th>
                            <th>Time Out</th>
                            <th>Hour(s)</th>
                            {/* <th>Remark</th> */}
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {todayhandle && todayhandle.map((item, index) => (
                            <tr key={item.id} className='border-gray-600 border-dotted border-b-2'>
                                <td>{index + 1}</td>
                                <td>{item.IATACode}{item.FlightNo}</td>
                                {/* <td>{item.Route}</td> */}
                                {/* <td>{item.Passenger}</td> */}
                                <td className='text-center'>{removeSecondsFromTimeDiff(item.TimeIn)}</td>
                                <td className='text-center'>{removeSecondsFromTimeDiff(item.TimeOut)}</td>
                                <td className='text-center'>{removeSecondsFromTimeDiff(item.Diff)}</td>
                                {/* <td>{item.Remark}</td> */}
                                <td className='flex text-center'><button className='bg-blue-600 text-white'><FaEdit /></button>
                                <button className='bg-red-600 text-white'><FaMinusCircle /></button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}


export default InadTodayHandle;

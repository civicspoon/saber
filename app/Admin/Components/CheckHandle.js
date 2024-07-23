import React from 'react';

function CheckHandle({ airlineid, month, year }) {
    const thaiMonths = [
        'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
        'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
    ];

    return (
        <div className='flex-1 p-4 m-2 rounded-lg shadow-lg'>
            <div className='font-semibold text-lg'>รายงานประจำเดือน : {thaiMonths[month-1]} ปี {year}</div>
        </div>
    );
}

export default CheckHandle;

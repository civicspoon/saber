'use client'
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
getDayOfWeek

import './style.css'
import { getData } from '@/app/Utils/RequestHandle';
import { formatNumber } from '@/app/Utils/Formatted';
import { DDMMYYY, getDayOfWeek,inadCharge,monthtext } from '@/app/utils/DateTimeConversion';
function Page() {
    const searchParams = useSearchParams()

    const airline = searchParams.get('airline')
    const month = searchParams.get('month')
    const year = searchParams.get('year')

    const [airport, setAirport] = useState(null);
    const [inadrate, setInadrate] = useState(null);
    const [data, setData] = useState(null);
    const [grandtotal, setGrandtotal] = useState(0)
    const [hourtotal, setHourtotal] = useState(0)
    const [maxindex, setMaxindex] = useState(0)


    useEffect(() => {
        if (airline && month && year) {
            const fetchData = async () => {
                const result = await getData(`${process.env.NEXT_PUBLIC_API_URL}/inadhandling/getmonthlyreport/${airline}/${month}/${year}`);
                setData(result); // Assuming result is an array and we're interested in the first item
            };
            fetchData();
            console.log('fetch');
        }
    }, [airline, month, year]);

    useEffect(() => {
        // Calculate grand total whenever data changes
        if (data) {
            let total = 0;
            let tmphour = 0
            
            data.forEach(val => {
                total += inadCharge(val.time_difference, val.InadRate);
                let [hours, minutes, seconds] = (val.time_difference).split(':').map(Number);
                if (minutes > 0) {
                    tmphour += hours + 1
                } 
                setAirport(data[0].Airport)
            });
            setGrandtotal(total.toFixed(2));
            setHourtotal(tmphour)
            console.log('le ', data.length);
        }

 
       
    }, [data]);

function splittextdate(date){
    const splittxt = date.split("T")
    console.log('====================================');
    console.log(splittxt[1]);
    const time  = splittxt[1].slice(0,-8)
    console.log('====================================');
    return(time)
}
    return (
        <div className='flex-1 items-center justify-center text-black' style={{ fontFamily: 'Sarabun, sans-serif' }}>
            <div className='w-full text-center' style={{ fontSize: '8pt', fontWeight: 'bold' }}>
                Monthly Summary Report for INAD of AOTGA at {airport} <br /> of {`${monthtext(month)} ${year}`}
            </div>
            <div className='flex  items-center text-center'> {/* Applied text-center to center the table */}
                <table className='w-full m-auto' style={{ fontSize: '5pt' }}>
                    <thead className='bg-gray-200' style={{ fontSize: '5pt' }}>
                        <tr>
                            <th className=' border px-2' style={{ width: '2%' }}>NO</th>
                            <th className=' border px-2' style={{ width: '8%' }}>DATE</th>
                            <th className=' border px-2' style={{ width: '4%' }}>DAY</th>
                            <th className=' border px-2' style={{ width: '7%' }}>FLT. NO</th>
                            <th className=' border px-2' style={{ width: '7%' }}>Routing</th>
                            <th className=' border px-2'>Passenger Name</th>
                            <th className=' border px-2' style={{ width: '3%' }}>Time IN</th>
                            <th className=' border px-2' style={{ width: '3%' }}>Time OUT</th>
                            <th className=' border px-2' style={{ width: '3%' }}>Total Hour</th>
                            <th className=' border px-2' style={{ width: '5%' }}>Number of PAX.</th>
                            <th className=' border px-2' style={{ width: "10%" }}>Rate Charge for INAD<br />Baht {inadrate} /1-INAD/1-Hour.</th>
                            <th className=' border px-2' style={{ width: 'auto' }}>REMARK.</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data && data.map((val, index) => (
                            <tr key={index}>
                                <td className=' border px-2'>{index + 1}</td>
                                <td className=' border px-2'>{DDMMYYY(new Date(val.DateVal))}</td>
                                <td className=' border px-2'>{getDayOfWeek(val.DateVal)}</td>
                                <td className=' border px-2'>{val.AirlineCode}{val.FlightNo}</td>
                                <td className=' border px-2'>{val.Route}</td>
                                <td className=' border px-2 text-start'>{val.Passenger}</td>
                                <td className=' border px-2'>{splittextdate(val.TimeIn)}</td>
                                <td className=' border px-2'>{splittextdate(val.TimeOut)}</td>
                                <td className=' border px-2'>{val.time_difference.slice(0, -3)}</td>
                                <td className=' border px-2'>1</td>
                                <td className=' border px-2  text-end'>{formatNumber(inadCharge(val.time_difference, val.InadRate))}</td>
                                <td className='uppercase  border px-2 text-start'>{val.Remark}</td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr className='font-bold'>
                            <td></td>
                            <td> Total </td>
                            <td>{data && data.length}</td>
                            <td> Flights </td>
                            <td></td>

                            <td></td>

                            <td></td>
                            <td></td>

                            <td className='border-b-2 border-black'>{hourtotal}</td>
                            <td className='border-b-2 border-black'>{data && data.length}</td>


                            <td className='border-b-2 border-black text-end'>{formatNumber(parseFloat(grandtotal))}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
}

export default Page;

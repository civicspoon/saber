'use client'
import { DDMMYYY, HHMM, getDayOfWeek, inadCharge, monthtext, timeToHHMM } from '@/app/Utils/DateTimeConversion';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { GetData, formatNumber } from '@/app/Utils/Datahandling';
import './style.css'
function page() {
    const searchParams = useSearchParams()

    const airline = searchParams.get('airline')
    const month = searchParams.get('month')
    const year = searchParams.get('year')

    const [airport, setAirport] = useState(null);
    const [airlinename, setAirlinename] = useState(null);

    const [inadrate, setInadrate] = useState(null);
    const [data, setData] = useState(null);
    const [grandtotal, setGrandtotal] = useState(0)
    const [hourtotal, setHourtotal] = useState(0)
    const [maxindex, setMaxindex] = useState(0)


    useEffect(() => {
        if (airline && month && year) {
            const fetchData = async () => {
                const result = await GetData(`${process.env.NEXT_PUBLIC_API_URL}/inadhandling/getmonthlyreport/${airline}/${month}/${year}`);
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
                setInadrate(data[0].InadRate)
                setAirlinename(data[0].Name)
            });
            setGrandtotal(total.toFixed(2));
            setHourtotal(tmphour)
            console.log('le ', data.length);
        }

 
       
    }, [data]);


    return (
        <div className='flex-1 items-center justify-center' style={{ fontFamily: 'Sarabun, sans-serif' }}>
            <div className='w-full text-center' style={{ fontSize: '8pt', fontWeight: 'bold' }}>
                Monthly Summary Report for INAD of {airlinename} at {airport} <br /> of {`${monthtext(month)} ${year}`}
            </div>
            <div className='flex  items-center text-center'> {/* Applied text-center to center the table */}
                <table className='w-full m-auto' style={{ fontSize: '6pt',fontWeight:'normal' }}>
                    <thead className='bg-gray-200'>
                        <tr>
                            <th className='border border-black px-2' style={{ width: '2%' }} >NO</th>
                            <th className='border border-black px-2' style={{ width: '8%' }}>DATE</th>
                            <th className='border border-black px-2' style={{ width: '4%' }}>DAY</th>
                            <th className='border border-black px-2' style={{ width: '5%' }}>FLT. NO</th>
                            <th className='border border-black px-2' style={{ width: '3%' }}>Routing</th>
                            <th className='border border-black px-2'>Passenger Name</th>
                            <th className='border border-black px-2' style={{ width: '4%' }}>Time IN</th>
                            <th className='border border-black px-2' style={{ width: '4%' }}>Time OUT</th>
                            <th className='border border-black px-2' style={{ width: '4%' }}>Total Hour</th>
                            <th className='border border-black px-2' style={{ width: '5%' }}>Number of PAX.</th>
                            <th className='border border-black px-2' style={{ width: "10%" }}>Rate Charge for INAD<br />Baht {inadrate} /1-INAD/1-Hour.</th>
                            <th className='border border-black px-2' >REMARK</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data && data.map((val, index) => (
                            <tr key={index}>
                                <td className='border border-black px-2'>{index + 1}</td>
                                <td className='border border-black px-2'>{DDMMYYY(new Date(val.DateVal))}</td>
                                <td className='border border-black px-2'>{getDayOfWeek(val.DateVal)}</td>
                                <td className='border border-black px-2'>{val.AirlineCode}{val.FlightNo}</td>
                                <td className='border border-black px-2'>{val.Route}</td>
                                <td className='border border-black px-2 text-start'>{val.Passenger}</td>
                                <td className='border border-black px-2'>{HHMM(val.TimeIn)}</td>
                                <td className='border border-black px-2'>{HHMM(val.TimeOut)}</td>
                                <td className='border border-black px-2'>{val.time_difference.slice(0, -3)}</td>
                                <td className='border border-black px-2'>1</td>
                                <td className='border  border-black  px-2  text-end'>{formatNumber(inadCharge(val.time_difference, val.InadRate))}</td>
                                <td className='uppercase border px-2  border-black text-start'>{val.Remark}</td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr className='font-bold'>
                            <td></td>
                            <td> Total </td>
                            <td>{data && data.length}</td>
                            <td>   {data && data.length === 1 ? 'Flight' : 'Flights'}
                            </td>
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

export default page;

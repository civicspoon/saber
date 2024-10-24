// ClientComponent.js
'use client';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import { GetData, formatNumber } from '@/app/Utils/Datahandling';
import { DDMMYYY, HHMM, getDayOfWeek, inadCharge, monthtext } from '@/app/Utils/DateTimeConversion';
import '@/app/Components/Print/depsummary/style.css';

function Page() {
    const [userdata, setUserdata] = useState(null);
    const [depid, setDepid] = useState(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const session = JSON.parse(sessionStorage.getItem('usdt'));
            setDepid(session.DepartmentID);
        }
    }, []);

    const searchParams = useSearchParams();

    const month = searchParams.get('month');
    const year = searchParams.get('year');

    const [airport, setAirport] = useState(null);
    const [airlinename, setAirlinename] = useState(null);
    const [inadrate, setInadrate] = useState(null);
    const [data, setData] = useState(null);
    const [grandtotal, setGrandtotal] = useState(0);
    const [hourtotal, setHourtotal] = useState(0);
    const [buttonVisible, setButtonVisible] = useState(true);
    const [prepareby,setPrepareby] = useState(null)
    const [manager,setManager] = useState(null)

    useEffect(() => {
        if (depid && month && year) {
            const fetchData = async () => {
                const result = await GetData(`${process.env.NEXT_PUBLIC_API_URL}/inadhandling/depmonthlyreport?depid=${depid}&month=${month}&year=${year}`);
                setData(result);
            };
            fetchData();
            console.log('fetch');
        }
    }, [depid, month, year]);

    useEffect(() => {
        if (data) {
            let total = 0;
            let tmphour = 0;

            data.forEach(val => {
                total += inadCharge(val.time_difference, val.InadRate);
                let [hours, minutes] = val.time_difference.split(':').map(Number);
                if (minutes > 0) {
                    tmphour += hours + 1;
                }else{
                    tmphour += hours
                }
                setAirport(data[0].Airport);
                setInadrate(data[0].InadRate);
                setAirlinename(data[0].Name);
                setPrepareby(data[0].ApproveBy)
                setManager(data[0].Manager)

            });
            setGrandtotal(total.toFixed(2));
            setHourtotal(tmphour);
            console.log('le ', data.length);
        }
    }, [data]);

    const handlePrint = () => {
        setButtonVisible(false);
        setTimeout(() => {
            window.print();
        }, 100); // Delay to ensure the button is hidden before the print dialog opens
    };

    useEffect(() => {
        const handleAfterPrint = () => setButtonVisible(true);
        window.addEventListener('afterprint', handleAfterPrint);

        return () => {
            window.removeEventListener('afterprint', handleAfterPrint);
        };
    }, []);

    return (
        <>
            {buttonVisible && (
                <div className='text-center my-2'>
                    <button onClick={handlePrint} className='px-4 py-2 bg-blue-500 text-white rounded'>
                        Print Report
                    </button>
                </div>
            )}
            <div className='flex-1 report items-center justify-center' style={{ fontFamily: 'Sarabun, sans-serif' }}>
                <div className='w-full text-center' style={{ fontSize: '10pt', fontWeight: 'bold' }}>
                    Monthly Summary Report for INAD of AOTGA at {airport} <br /> of {`${monthtext(month)} ${year}`}
                </div>

                <div className='flex items-center text-center'>
                    <table className='w-full m-auto' style={{ fontSize: '8pt', fontWeight: 'normal' }}>
                        <thead className='bg-gray-200'>
                            <tr>
                                <th className='border border-black px-2' style={{ width: '2%' }}>NO</th>
                                <th className='border border-black px-2' style={{ width: '8%' }}>DATE</th>
                                <th className='border border-black px-2' style={{ width: '4%' }}>DAY</th>
                                <th className='border border-black px-2' style={{ width: '5%' }}>FLT. NO</th>
                                <th className='border border-black px-2' style={{ width: '3%' }}>Routing</th>
                                <th className='border border-black px-2' style={{ width: '20%' }}>Passenger Name</th>
                                <th className='border border-black px-2' style={{ width: '4%' }}>Time IN</th>
                                <th className='border border-black px-2' style={{ width: '4%', }}>Time OUT</th>
                                <th className='border border-black px-2' style={{ width: '4%' }}>Total Hour</th>
                                <th className='border border-black px-2' style={{ width: '5%' }}>Number of PAX.</th>
                                <th className='border border-black px-2' style={{ width: "15%",fontSize: '7pt' }}>Rate Charge for INAD<br />Baht {inadrate} /1-INAD/1-Hour.</th>
                                <th className='border border-black px-2'>REMARK</th>
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
                                    <td className='border border-black px-2 '>1</td>
                                    <td className='border border-black px-2 text-end'>{formatNumber(inadCharge(val.time_difference, val.InadRate))}</td>
                                    <td className='uppercase border border-black px-2 text-start'>{val.Remark}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr className='font-bold'>
                                <td></td>
                                <td>Total</td>
                                <td><span className='underline'>{data && data.length}</span></td>
                                <td>{data && data.length === 1 ? 'Flight' : 'Flights'}</td>
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

                <div className='flex w-full'>
                    <div className='w-2/5'></div>
                    <div className='w-3/5 mt-6  flex flex-col' style={{ fontSize: '8pt' }}>

                        <div className='text-left ml-11'>
                            Prepared by ______________________({prepareby}) ______________________({manager})
                        </div>


                        <div className='text-left mt-5  ml-11 '>
                            Verified by _______________________(Wikornthip Sinchai) ______________________(Kachean Kittipreechasak)
                        </div>

                    </div>
                </div>


            </div >

        </>
    );
}

export default function PageWrapper() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Page />
        </Suspense>
    );
}

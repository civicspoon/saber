"use client";
import React, { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import aot from "@/public/logo-aot.png";
import { DDMMYYY, monthtext } from "@/app/Utils/DateTimeConversion";
import { thbtxt } from "@/app/Utils/DateTimeConversion";
import { formatNumber, GetData } from "@/app/Utils/Datahandling";
import { useSearchParams } from "next/navigation";
import Style from "@/app/Components/Print/monthly/Style.css";

function PageContent() {
    const searchParams = useSearchParams();

    const [depid, setDepid] = useState(searchParams.get('depid'));
    const [data, setData] = useState(null);
    const [totalcost, setTotalcost] = useState(0);
    const [airlinecode, setAirlinecode] = useState('');
    const [airport, setAirport] = useState('');
    const [customerCode, setCustomerCode] = useState('');
    const [totalHour, setTotalHour] = useState(0);
    const [groupedFlights, setGroupedFlights] = useState([]);
    const [buttonVisible, setButtonVisible] = useState(true);

    
    const airline = searchParams.get('airline');
    const month = searchParams.get('month');
    const year = searchParams.get('year');

    useEffect(() => {
        if (depid && month && year) {
            const fetchData = async () => {
                const result = await GetData(`${process.env.NEXT_PUBLIC_API_URL}/inadhandling/depmonthlyreport?depid=${depid}&month=${month}&year=${year}`);
                setData(result);
            };
            fetchData();
        }
    }, [depid, month, year]);

    useEffect(() => {
        if (data) {
            calculate();
            setGroupedFlights(groupFlightsByNumber(data));
        }
    }, [data]);

    const calculate = () => {
        let cost = 0;
        let totalHourTmp = 0;

        data.forEach(item => {
            const [hours, minutes] = item.time_difference.split(':').map(Number);
            cost += (hours * 168.22);
            totalHourTmp += hours;
            if (minutes > 1) {
                cost += 168.22;
                totalHourTmp++;
            }
        });

        setTotalcost(cost);
        setTotalHour(totalHourTmp);
        setAirlinecode(data[0]?.AirlineCode || '');
        setCustomerCode(data[0]?.CustomerCode || '');
        setAirport(data[0]?.Airport || '');
    };

    const groupFlightsByNumber = (data) => {
        const groupedFlights = data.reduce((acc, flight) => {
            const flightKey = `${flight.AirlineCode}${flight.FlightNo}`;
            if (!acc[flightKey]) {
                acc[flightKey] = new Set();
            }
            const date = new Date(flight.DateVal);
            const formattedDate = date.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
            acc[flightKey].add(formattedDate);
            return acc;
        }, {});

        // Convert sets to arrays
        for (let flightKey in groupedFlights) {
            groupedFlights[flightKey] = Array.from(groupedFlights[flightKey]);
        }

        return groupedFlights;
    };

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

    if (!depid || !month || !year) {
        return <div>Loading...</div>;
    }

    const datatmp = {
        "AirlineCode": airlinecode,
        "Airport": airport,
        "Monthly": `${monthtext(month)} ${year}`,
        "InadCost": 168.22,
        "TotalHour": totalHour,
        "BeforeVat": totalcost,
        "CustomerCode": customerCode
    };

    return (
        <>
            {buttonVisible && (
                <div className='text-center my-2'>
                    <button onClick={handlePrint} className='px-4 py-2 bg-blue-500 text-white rounded'>
                        Print Report
                    </button>
                </div>
            )}
            <div
                className="report flex-1 bg-white text-black p-5"
                style={{
                    width: '210mm',
                    height: '297mm',
                    fontFamily: 'THSarabun, sans-serif',
                    fontSize: '16pt'
                }}
            >                <div className='print-header'>
                    <div className='flex'>
                        <Image
                            src={aot}
                            style={{ width: 'auto', height: '20mm' }}
                            className='mr-5'
                            alt=''
                        />
                        <div className='flex-row w-full mt-2'>
                            <div>บริษัท รักษาความปลอดภัย ท่าอากาศยานไทย จำกัด</div>
                            <div>AOT Aviation Security Company Limited</div>
                        </div>
                        <div className='-pr-2 w-full flex text-3xl justify-end text-end mt-2'>
                            Pre
                        </div>
                    </div>
                </div>

                <div className='flex w-full mt-2'>
                    <div className='w-4/5' style={{ fontSize: '10pt' }}>
                        222 ห้อง 2001-2002 ชั้น 2 อาคารส่วนกลาง ท่าอากาศยานดอนเมือง ถนนวิภาวดีรังสิต <br />
                        แขวงสนามบิน เขตดอนเมือง กรุงเทพฯ 10210 (สำนักงานใหญ่) <br />
                        222 Room 2001-2002 2nd Floor, Central Block Building, Don Mueang International Airport, Vibhavadi Rangsit Road, <br />
                        Sanambin, Don Mueang, Bangkok 10210 (Head office) <br />
                        โทร 0-2504-3560 เลขประจำตัวผู้เสียภาษี TAX ID. 0105562171073
                        <div className='flex' style={{ fontSize: '12pt' }}>
                            <div className='mt-1 w-1/4' >รหัสลูกค้า<br />Customer Code</div>
                            <div className='mt-1 -ml-6' >{datatmp.CustomerCode}</div>
                            <div className='mt-1 ml-20' >TAX ID {'0105561176136 Head Office'}</div>
                        </div>
                        <div className='flex'>
                            <div className='mt-1 w-1/6' style={{ fontSize: '12pt' }}>ชื่อลูกค้า<br />Name</div>
                            <div className='mt-1 ml-3' style={{ fontSize: '12pt' }}>
                                AOT Ground Aviation Services Co., Ltd.<br />
                                222 Room No.4326, 4th Floor, Terminal 1, <br />
                                Don Mueang Airport Vibhavadi Rangsit Rd, Don Mueang,<br />
                                Bangkok 10210
                            </div>
                        </div>
                    </div>
                    <div className='mt-16 ml-16 w-2/5' style={{ fontSize: '12pt' }}>
                        Report ISSUED ON <span className='ml-10 text-end'>{DDMMYYY()}</span>
                    </div>
                </div>

                {/* Table */}
                <div className='w-full mt-3'>
                    <table className='w-full ' style={{ fontSize: '12pt' }}>
                        <thead >
                            <tr>
                                <th className=' border border-black font-thin' style={{ width: '12%' }}>รหัสสินค้า<br /> Product Name</th>
                                <th className='border  border-black  font-thin' >รายการสินค้า / บริการ<br /> DESCRIPTION</th>
                                <th className='border  border-black font-thin' style={{ width: '7%' }}>จำนวน<br /> QUANTITY</th>
                                <th className='border border-black  font-thin' style={{ width: '5%' }}>หน่วย<br /> UNIT</th>
                                <th className='border  border-black font-thin' style={{ width: '15%' }}>ราคาต่อหน่วย<br /> UNIT PRICE</th>
                                <th className='border  border-black font-thin' style={{ width: '20%' }}>จำนวนเงิน<br /> AMOUNT</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className='border' style={{ height: '250pt', verticalAlign: 'top' }}>
                                <td className='border text-center  border-black ' ><div>{datatmp.CustomerCode}</div></td>
                                <td className='border  border-black px-2' >
                                    Security Service Charge for Escort Deportee Flight at <br />
                                    {datatmp.Airport} {/* Airport */}<br />
                                    for {datatmp.Monthly} {/* Monthly */} <br /><br />
                                    <div className='pl-2 w-full'>
                                        1. Security Agent for Escort Deportee<br />
                                        {Object.entries(groupedFlights).map(([flightNo, dates], index) => (
                                            <span key={index}>
                                                -{flightNo} on {dates.join(', ')} <br />
                                            </span>
                                        ))}
                                        {`(${datatmp.TotalHour} Hours x ${datatmp.InadCost} Baht)`} {/* {Calculate Hour x bath }  */} <br />
                                        Baht {datatmp.InadCost} per 1-INAD per 1-hour <br />
                                        Fraction of an hour is one hour
                                    </div>
                                </td>
                                <td className='border  border-black  px-2' ></td>
                                <td className='border border-black  px-2' ></td>
                                <td className='border border-black px-2' ></td>
                                <td className='border border-black text-end items-center' >{formatNumber(datatmp.BeforeVat)}</td>
                            </tr>
                            <tr >
                                <td className='text-end pr-2' colSpan={5} style={{ borderLeft: 'none', borderBottom: 'none' }}>จำนวนเงินก่อนภาษีมูลค่าเพิ่ม<br />TOTAL AMOUNT BEFORE VAT
                                </td>
                                <td className='border  border-black text-end'  >{formatNumber(datatmp.BeforeVat)}</td>
                            </tr>
                            <tr >
                                <td className='text-end pr-2' colSpan={5} style={{ borderLeft: 'none', borderBottom: 'none' }}>จำนวนภาษีมูลค่าเพิ่ม<br />VAT AMOUNT 7%
                                </td>
                                <td className='border  border-black text-end' >{formatNumber(datatmp.BeforeVat * 0.07)}</td>
                            </tr>
                            <tr >
                                <td className='text-end pr-2' colSpan={5} style={{ borderLeft: 'none', borderBottom: 'none' }}>
                                    <div></div><div></div>จำนวนเงินรวม<br />GRAND TOTAL
                                </td>
                                <td className='border border-black  text-end'>{formatNumber((datatmp.BeforeVat) + (datatmp.BeforeVat * 0.07))}</td>
                            </tr>
                        </tbody>
                    </table>
                    <div className='flex w-full' style={{ fontSize: '12pt' }}>
                        <div className='flex w-auto border border-black  p-1 '>
                            <div className='mr-1 w-10'>บาท <br /> Baht</div>
                            <div className='flex w-auto justify-center  text-center items-center' > {thbtxt((((datatmp.BeforeVat) + (datatmp.BeforeVat * 0.07)).toFixed(2)).toString())}</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

function Page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <PageContent />
        </Suspense>
    );
}

export default Page;

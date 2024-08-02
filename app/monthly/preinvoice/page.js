"use client";
import React, { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import aot from "@/public/logo-aot.png";
import { DDMMYYY, monthtext } from "@/app/Utils/DateTimeConversion";
import { thbtxt } from "@/app/Utils/DateTimeConversion";
import { formatNumber, GetData } from "@/app/Utils/Datahandling";
import { useSearchParams } from "next/navigation";
import Style from "@/app/Components/Print/monthly/Style.css";
import { processFlightData } from "@/app/Utils/Preinv";

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
    const [preinvdata, setPreinvdata] = useState([]);
    const [month,setMonth] = useState(null)
    const [year,setYear] = useState(null)

    const invno = searchParams.get('invNo');


useEffect(()=>{
    getinvreocrd()
},[invno])

const getinvreocrd =  async () =>{
    const result = await GetData(`${process.env.NEXT_PUBLIC_API_URL}/preinv/get?id=${invno}`);
    setDepid(result.data.DepartmentID)
    const issuedDate = new Date(result.data.Issued);
    setMonth(issuedDate.getMonth())
    setYear(issuedDate.getFullYear())

    console.log(depid,month,year);

}

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
            const processedData = processFlightData(data);
            setPreinvdata(processedData);
            setGroupedFlights(groupFlightsByNumber(data));
            calculate(processedData);

            console.log(preinvdata);
        }
    }, [data]);

    const calculate = (processedData) => {
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
            >
                <div className='print-header'>
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
                        <div className='flex flex-col  w-80 text-center mr-10'>
                            <div className="text-7xl justify-end text-center mt-2 font-bold"> Pre </div>
                            <div className="text-sm w-full -mt-2">
                                ใบแจ้งหนี้ / INVOICE
                            </div>
                        </div>

                    </div>
                </div>

                <div className='flex w-full -mt-2'>
                    <div className='w-4/5' style={{ fontSize: '10pt' }}>
                        222 ห้อง 2001-2002 ชั้น 2 อาคารส่วนกลาง ท่าอากาศยานดอนเมือง <br /> ถนนวิภาวดีรังสิต
                        แขวงสนามบิน เขตดอนเมือง กรุงเทพฯ 10210 (สำนักงานใหญ่) <br />
                        222 Room 2001-2002 2nd Floor, Central Block Building, Don Mueang International Airport,<br /> Vibhavadi Rangsit Road,
                        Sanambin, Don Mueang, Bangkok 10210 (Head office) <br />
                        โทร 0-2504-3560 เลขประจำตัวผู้เสียภาษี TAX ID. 0105562171073
                        <div className='flex' style={{ fontSize: '12pt' }}>
                            <div className='mt-1 w-1/4' style={{ fontSize: '10pt' }}><span >รหัสลูกค้า</span><div className="-mt-2">Customer Code</div></div>
                            <div className='mt-1 -ml-7' >435201 {datatmp.CustomerCode}</div>
                            <div className='mt-1 ml-5' >TAX ID {'0105561176136 Head Office'}</div>
                        </div>
                        <div className='flex'>
                            <div className='mt-1 w-1/6' style={{ fontSize: '10pt' }}>ชื่อลูกค้า<div className="-mt-2">Name</div></div>
                            <div className='mt-1 ml-3' style={{ fontSize: '12pt' }}>
                                AOT Ground Aviation Services Co., Ltd.<br />
                                222 Room No.4326, 4th Floor, Terminal 1, <br />
                                Don Mueang Airport Vibhavadi Rangsit Rd, Don Mueang,<br />
                                Bangkok 10210
                            </div>
                        </div>
                    </div>
                    <div className=" w-8/12 pt-2" style={{ fontSize: '10pt' }}>
                        <div className="">เลขที่ NO. <span className="ml-44">{invno}</span></div>
                        <div className="mt-20">วันที่ออกใบแจ้งหนี้</div>
                        <div className="-mt-2">INVOICE ISSUED ON</div>

                        <div className="mt-1">วันที่กำหนดชำระ</div>
                        <div className="-mt-2">DUE DATE</div>

                        <div className="mt-1">คำขอเลขที่</div>
                        <div className="-mt-2">REQUEST NO.</div>

                        <div className="mt-1">สัญญาเลขที่</div>
                        <div className="-mt-2">CONTRACT NO.</div>
                    </div>

                </div>

                {/* Table */}
                <div className='w-full mt-3'>
                    <table className='w-full ' style={{ fontSize: '12pt' }}>
                    <thead>
                            <tr>
                            <th className=' border border-black font-thin' style={{ width: '12%' }}>รหัสสินค้า<br /> Product Name</th>
                                <th className='border  border-black  font-thin' >รายการสินค้า / บริการ<br /> DESCRIPTION</th>
                                <th className='border  border-black font-thin' style={{ width: '7%' }}>จำนวน<br /> QUANTITY</th>
                                <th className='border border-black  font-thin' style={{ width: '5%' }}>หน่วย<br /> UNIT</th>
                                <th className='border  border-black font-thin' style={{ width: '10%' }}>ราคาต่อหน่วย<br /> UNIT PRICE</th>
                                <th className='border  border-black font-thin' style={{ width: '15%' }}>จำนวนเงิน<br /> AMOUNT</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className='border' style={{ height: '250pt', verticalAlign: 'top' }}>
                                <td className='border text-center  border-black ' ><div>AOTGA-Security Service 435201{datatmp.CustomerCode}</div></td>
                                <td className='border  border-black px-2' >
                                    Security Service Charge for INAD Passenger and Deportee Escort<br />
                                    at {datatmp.Airport} {/* Airport */}<br />
                                    for {datatmp.Monthly} {/* Monthly */} <br /><br />
                                    <div className='pl-2 w-full -mt-5'>
                                        1. Security Service Charge for INAD Passenger and Deportee Escort <br />
                                           {preinvdata.map((flight, index) => (
                                            <span key={index}>
                                                for Flight  {flight.Flight} on {flight.Dates.join(', ')}   {datatmp.Monthly}<br />
                                                ({flight.Time} {flight.Time === 1 ? 'hour' : 'hours'}  x {datatmp.InadCost} Baht  = {formatNumber(parseInt(flight.Time) * (datatmp.InadCost))} Baht) <br />
                                            </span>
                                        ))}
                                       {/*  {`(${datatmp.TotalHour} Hours x ${datatmp.InadCost} Baht)`} = {formatNumber(datatmp.BeforeVat)}) {Calculate Hour x bath }   <br />*/}
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
                                <td colSpan={2} rowSpan={3} className=" align-text-top" style={{ fontSize: '11pt' }}>
                                    <div>โปรดชำระด้วยเช็คขีดคร่อมในนาม <span className="font-semibold" > บริษัท รักษาความปลอดภัย ท่าอากาศยานไทย จำกัด</span></div>
                                    <div>Please make payment by cross cheque pay to  <span className="font-semibold" > AOT Aviation Security Company Limited</span></div>
                                    <div>หรือ โอนเงินเข้าบัญชีออมทรัพย์ ธนาคารกรุงไทย สาขาท่าอากาศยานกรุงเทพ เลขที่บัญชี 378-0-12452-1</div>
                                    <div>or Please transfer the amount to Saving Account No. 378-0-12452-1 KTB Bangkok Airport Branch</div>
                                </td>
                                <td className='text-end pr-2' colSpan={3} style={{ borderLeft: 'none', borderBottom: 'none' }}>จำนวนเงินก่อนภาษีมูลค่าเพิ่ม<br />TOTAL AMOUNT BEFORE VAT
                                </td>
                                <td className='border  border-black text-end'  >{formatNumber(datatmp.BeforeVat)}</td>
                            </tr>
                            <tr >
                                <td className='text-end pr-2' colSpan={3} style={{ borderLeft: 'none', borderBottom: 'none' }}>จำนวนภาษีมูลค่าเพิ่ม<br />VAT AMOUNT 7%
                                </td>
                                <td className='border  border-black text-end' >{formatNumber(datatmp.BeforeVat * 0.07)}</td>
                            </tr>
                            <tr >
                                <td className='text-end pr-2' colSpan={3} style={{ borderLeft: 'none', borderBottom: 'none' }}>
                                    <div></div><div></div>จำนวนเงินรวม<br />GRAND TOTAL
                                </td>
                                <td className='border border-black  text-end'>{formatNumber((datatmp.BeforeVat) + (datatmp.BeforeVat * 0.07))}</td>
                            </tr>
                        </tbody>
                    </table>
                    <div className='flex w-full' style={{ fontSize: '12pt' }}>
                        <div className='flex flex-col  w-3/5'>
                            <div className='flex w-full  border border-black  p-1 '>
                                <div className='mr-1 w-10'>บาท <br /> Baht</div>
                                <div className='flex w-auto justify-center  text-center items-center' > {thbtxt((((datatmp.BeforeVat) + (datatmp.BeforeVat * 0.07)).toFixed(2)).toString())}</div>
                            </div>
                            <div className="mt-1 border border-black  p-1 ">
                                <div style={{ fontSize: '8pt' }}>
                                    รับสินค้า / บริการ ตามรายการข้างต้นนี้ไว้โดยถูกต้องครบถ้วนแล้ว
                                </div>
                                <div className="mt-5 flex text-center">
                                    <div className="w-1/2">
                                        <div>___________________________________</div>
                                        <div style={{ fontSize: '10pt' }}>
                                            ตรวจและรับโดย Received By
                                        </div>
                                        <div className="mt-2" style={{ fontSize: '10pt' }}>
                                            วันที่ Date _______ /_______ /_______
                                        </div>
                                    </div>
                                    <div className="w-1/2">
                                        <div>___________________________________</div>
                                        <div style={{ fontSize: '10pt' }}>
                                            นำส่งโดย Delivered By
                                        </div>
                                        <div className="mt-2" style={{ fontSize: '10pt' }}>
                                            วันที่ Date _______ /_______ /_______
                                        </div>
                                    </div>

                                </div>

                            </div>
                        </div>
                        <div className="w-2/5 pt-16 text-center items-center text-black justify-center">
                            <div>___________________________________</div>
                            <div style={{ fontSize: '10pt' }}>
                                ผู้มีอำนาจลงนาม Authorized Signature
                            </div>
                            <div className="mt-2" style={{ fontSize: '10pt' }}>
                            วันที่ Date _______ /_______ /_______
                            </div>                        </div>


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

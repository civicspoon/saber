"use client"
import React, { Suspense, useEffect, useState } from 'react';
import Image from "next/image";
import aot from "@/public/logo-aot.png";
import { DDMMYYY, monthtext } from '@/app/Utils/DateTimeConversion';
import { thbtxt } from '@/app/Utils/DateTimeConversion';
import { formatNumber, GetData } from '@/app/utils/Datahandling';
import { useSearchParams } from 'next/navigation'

function Page() {
    const searchParams = useSearchParams()

    // const { airline, month, year } = router.query;
    const airline = searchParams.get('airline')
    const month = searchParams.get('month')
    const year = searchParams.get('year')

    const [data, setData] = useState(null);
    const [totalcost, setTotalcost] = useState(0);
    const [airlinecode , setAirlinecode] = useState('')
    
    const [airport , setAirport] = useState('')
    const [customerCode , setCustomerCode] = useState('')

    const [totalHoure, setTotalHoure] = useState(0);
    const [flightno, setFlightno] = useState([]);
    const [datearr, setDatearr] = useState([]);



    useEffect(() => {
        if (airline && month && year) {
            const fetchData = async () => {
                const result = await GetData(`${process.env.NEXT_PUBLIC_API_URL}/inadhandling/getmonthlyreport/${airline}/${month}/${year}`);
                setData(result); // Assuming result is an array and we're interested in the first item
            };
            fetchData();
        }
    }, [airline, month, year]);

    useEffect(()=>{
        Calculate()
    },[data])
    const Calculate = () =>{
        setTotalcost(0)
        setTotalHoure(0)
        let cost = 0
        let totalHoureTmp = 0
        let tmpflightno=[]
        let tmpdate = []
      

        for(let i in data ){
            
            const [hours, minutes, seconds]  = (data[i].time_difference).split(':').map(Number);;
            cost +=(hours*168.22);
            totalHoureTmp += hours
            tmpflightno.push(`${data[i].AirlineCode}${data[i].FlightNo}`)
            const date = new Date(data[i].TimeIn)
            tmpdate.push(date.getUTCDate())
            if(minutes > 1){
                cost+=168.22
                totalHoureTmp++
            }

            console.log('Cost====================================');
           setTotalcost(cost);
           setTotalHoure(totalHoureTmp)
           setAirlinecode(data[0].AirlineCode)
           setDatearr(tmpdate)
           setFlightno(tmpflightno) 
            setCustomerCode(data[0].CustomerCode)
            setAirport(data[0].Airport)
            console.log('====================================');
        }

        console.log('Total Cost====================================');
        console.log();
        console.log('====================================');

    }
    if (!airline || !month || !year) {
        return <div>Loading...</div>;
    }

    const datatmp = {
        "AirlineCode": airlinecode,
        "Airport": airport,
        "Monthly": `${monthtext(month)} ${year}`,
        "InadCost": 168.22,
        "TotalHour": totalHoure,
        "BeforeVat": totalcost,       
        "FlightList": flightno,
        "DateList": datearr,
        "CustomerCode": customerCode
    };

    return (
        
        <Suspense fallback={<div>Loading...</div>}>

        <div style={{ width: '210mm', height: '297mm', fontFamily: 'Sarabun, sans-serif', fontSize: '16pt' }} className="flex-1 bg-white text-black p-5">
            <div className='flex'>
                <Image
                    src={aot}
                    style={{ width: 'auto', height: '20mm' }}
                    className='mr-5'
                    alt=''
                />
                <div className='flex-row w-full mt-2'>
                    <div >บริษัท รักษาความปลอดภัย ท่าอากาศยานไทย จำกัด</div>
                    <div  >AOT Aviation Security Company Limited</div>
                </div>
                <div className='w-full flex justify-end text-end mt-2'>
                    Inadmissible Passenger Report (INAD)
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

            <div className='w-full  mt-3'>

                <table className='w-full ' style={{ fontSize: '12pt' }}>
                    <thead >
                        <tr>
                            <th className='tableboder font-thin' style={{ width: '12%' }}>รหัสสินค้า<br /> Product Name</th>
                            <th className='tableboder  font-thin' >รายการสินค้า / บริการ<br /> DESCRIPTION</th>
                            <th className='tableboder font-thin' style={{ width: '7%' }}>จำนวน<br /> QUANTITY</th>
                            <th className='tableboder font-thin' style={{ width: '5%' }}>หน่วย<br /> UNIT</th>
                            <th className='tableboder font-thin' style={{ width: '15%' }}>ราคาต่อหน่วย<br /> UNIT PRICE</th>
                            <th className='tableboder font-thin' style={{ width: '20%' }}>จำนวนเงิน<br /> AMOUNT</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className='tableboder' style={{ height: '250pt', verticalAlign: 'top' }}>
                            <td className='tableboder text-center' ><div>{datatmp.CustomerCode}</div></td>
                            <td className='tableboder' >
                                Security Service Charge for Escort Deportee Flight { datatmp.AirlineCode } {/* Flight  */}<br />
                                    at { datatmp.Airport } {/* Airport */}<br />
                                    for { datatmp.Monthly } {/* Monthly */} <br /><br />
                                  <div className='pl-2 w-full'>
                                    1. Security Agent for Escort Deportee<br/>
                                    for {datatmp.FlightList.map((flight,index)=>( <span key={index}> {flight}, </span>))} <br/>
                                    on {datatmp.DateList.map((datelist,index)=>( <span key={index}> {datelist}, </span>))} { datatmp.Monthly }<br/>
                                    { `(${datatmp.TotalHour} Hours x ${datatmp.InadCost} Baht)` } {/* {Calculate Hour x bath }  */} <br />
                                    Baht {datatmp.InadCost} per 1-INAD per 1-hour <br />
                                    Fraction of an hour is one hour
                                    </div>
                                
                            </td>
                            <td className='tableboder' ></td>
                            <td className='tableboder' ></td>
                            <td className='tableboder' ></td>
                            <td className='tableboder text-end items-center' >{formatNumber(datatmp.BeforeVat)}</td>
                        </tr>
                        <tr >

                            <td className='text-end pr-2' colSpan={5} style={{ borderLeft: 'none', borderBottom: 'none' }}>จำนวนเงินก่อนภาษีมูลค่าเพิ่ม<br />TOTAL AMOUNT BEFORE VAT
                            </td>
                            <td className='tableboder text-end'  >{formatNumber(datatmp.BeforeVat)}</td>
                        </tr>
                        <tr >

                            <td className='text-end pr-2' colSpan={5} style={{ borderLeft: 'none', borderBottom: 'none' }}>จำนวนภาษีมูลค่าเพิ่ม<br />VAT AMOUNT 7%
                            </td>
                            <td className='tableboder text-end' >{ formatNumber(datatmp.BeforeVat*0.07) }</td>
                        </tr>
                        <tr >

                            <td className='text-end pr-2' colSpan={5} style={{ borderLeft: 'none', borderBottom: 'none' }}>
                                <div></div><div></div>จำนวนเงินรวม<br />GRAND TOTAL
                            </td>
                            <td  className='tableboder text-end'>{ formatNumber((datatmp.BeforeVat)+(datatmp.BeforeVat*0.07)) }</td>
                        </tr>
                    </tbody>
                </table>
                <div className='flex w-full' style={{ fontSize: '12pt' }}>
                    <div className='flex w-auto tableboder p-1 border-black'>
                        <div className='mr-1 w-10'>บาท <br /> Baht</div>
                        <div className='flex w-auto justify-center  text-center items-center' > {thbtxt((((datatmp.BeforeVat)+(datatmp.BeforeVat*0.07)).toFixed(2)).toString())}</div>
                    </div>
                </div>
            </div>

        </div>
        </Suspense>

    );
}

export default Page;

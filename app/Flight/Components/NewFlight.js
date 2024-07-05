import { useState } from 'react';
import AirlineSelect from './AirlineSelect';
import { FaSave } from 'react-icons/fa';
import { postData } from '@/app/Utils/RequestHandle';
import Swal from 'sweetalert2';

function NewFlight() {
    const [selectedAirline, setSelectedAirline] = useState(null);
    const [route, setRoute] = useState('');
    const [flightNo, setflightNo] = useState('');

    const handleAirlineSelect = (selectedValue) => {
        setSelectedAirline(selectedValue);
        console.log("Selected Airline:", selectedValue);
    };

    const handleSave = async () => {
        try {
            if (!selectedAirline || !route || !flightNo) {
                Swal.fire({
                    icon: 'warning',
                    title: 'กรุณากรอกข้อมูลให้ครบถ้วน',
                    text: 'โปรดตรวจสอบและกรอกข้อมูลให้ครบถ้วนก่อนทำการบันทึก',
                });
                return;
            }

            const data = {
                airline: selectedAirline,
                route: route,
                flightNumber: flightNo,
            };

            const response = await postData(`${process.env.NEXT_PUBLIC_API_URL}/flight/newflight`, data);

            if (response.status === 201) {
                Swal.fire({
                    icon: 'success',
                    title: 'บันทึกสำเร็จ!',
                    text: 'บันทึกข้อมูลเที่ยวบินเรียบร้อยแล้ว',
                });

                // Reset form fields if needed
                setRoute('');
                setflightNo('');

                console.log('New flight added:', response.data);
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'เกิดข้อผิดพลาด!',
                    text: 'ไม่สามารถบันทึกข้อมูลเที่ยวบินได้ กรุณาลองใหม่ภายหลัง',
                });
                console.error('Error adding new flight:', response.data);
            }
        } catch (error) {
            console.error('Error adding new flight:', error);
            Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด!',
                text: 'เกิดข้อผิดพลาดในการเพิ่มข้อมูลเที่ยวบิน กรุณาลองใหม่ภายหลัง',
            });
        }
    };

    return (
        <div>
            <h2 className="cardheader text-xl font-bold">เพิ่มเที่ยวบิน</h2>
            <div>
                สายการบิน(ภาษาอังกฤษเท่านั้น)
                <AirlineSelect onAirlineSelect={handleAirlineSelect} />
            </div>
            <div>
                เส้นทางบิน Route
                <input
                    type="text"
                    placeholder="เส้นทางบิน"
                    className="placeholder:text-gray-300 uppercase"
                    value={route}
                    onChange={(e) => setRoute(e.target.value)}
                />
            </div>
            <div>
               เลขเที่ยวบิน(ตัวเลขเท่านั้น)
                <input
                    type="text"
                    placeholder="ตัวเลข"
                    className="placeholder:text-gray-300 uppercase w-32"
                    value={flightNo}
                    onChange={(e) => setflightNo(e.target.value)}
                />
                <button className="bg-green-500 flex items-center ml-2" onClick={handleSave}>
                    <FaSave className="mr-2" /> บันทึก
                </button>
            </div>
        </div>
    );
}

export default NewFlight;

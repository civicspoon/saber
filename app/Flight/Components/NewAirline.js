import { postData } from '@/app/Utils/RequestHandle';
import React, { useEffect, useState } from 'react';
import { FaSave } from 'react-icons/fa'; // นำเข้าไอคอนที่ต้องการใช้
import Swal from 'sweetalert2';

function NewAirline() {
    const [departmentid, setDepartmentid] = useState(null);
    const [sessiondata, setSessiondata] = useState(null);
    const [name, setName] = useState('');
    const [iataCode, setIataCode] = useState('');
    const [code, setCode] = useState('');
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const data = await JSON.parse(sessionStorage.getItem('usdt'));
            setSessiondata(data);
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (sessiondata && sessiondata.DepartmentID) {
            setDepartmentid(sessiondata.DepartmentID);
        }
    }, [sessiondata]);

    const handleSave = async () => {
        try {
            if (!departmentid) {
                console.error('Department ID is not set');
                return;
            }

            const data = {
                Name: name,
                IATACode: iataCode,
                DepartmentID: departmentid,
                CustomerCode: code
            };

            const response = await postData(`${process.env.NEXT_PUBLIC_API_URL}/airline/addnew`, data);

            if (response.status === 201) {
                Swal.fire({
                    icon: 'success',
                    title: 'บันทึกสำเร็จ!',
                    text: 'บันทึกข้อมูลสายการบินเรียบร้อยแล้ว',
                });

                // Reset form fields
                setName('');
                setIataCode('');
                setCode('');

                // Close modal or perform other actions here
                setModalVisible(false);

                console.log('New airline added:', response.data);
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'เกิดข้อผิดพลาด!',
                    text: 'ไม่สามารถบันทึกข้อมูลสายการบินได้ กรุณาลองใหม่ภายหลัง',
                });
                console.error('Error adding new airline:', response.data);
            }
        } catch (error) {
            console.error('Error adding new airline:', error);
            Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด!',
                text: 'เกิดข้อผิดพลาดในการเพิ่มข้อมูลสายการบิน กรุณาลองใหม่ภายหลัง',
            });
        }
    };

    return (
        <div>
            <h2 className="cardheader text-xl font-bold">เพิ่มสายการบิน</h2>
            <div>
                สายการบิน(ภาษาอังกฤษเท่านั้น)
                <input
                    type="text"
                    placeholder="สายการบิน(ภาษาอังกฤษเท่านั้น)"
                    className="placeholder:text-gray-300 uppercase"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>
            <div>
                รหัสสายการบิน(IATA CODE)<br />
                <input
                    type="text"
                    placeholder="CODE"
                    className="placeholder:text-gray-300 uppercase w-20"
                    value={iataCode}
                    onChange={(e) => setIataCode(e.target.value)}
                />
                <button className="bg-green-500 flex items-center ml-2" onClick={handleSave}>
                    <FaSave className="mr-2" /> บันทึก
                </button>
            </div>
        </div>
    );
}

export default NewAirline;

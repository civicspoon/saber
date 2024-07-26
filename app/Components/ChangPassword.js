'use client'
import { useEffect, useState } from "react";
import { FaKey } from "react-icons/fa";
import { getData, postData } from "../Utils/RequestHandle";
import Swal from "sweetalert2";

function ChangePassword() {
    const [oldpass, setOldpassword] = useState("");
    const [newpass, setNewpassword] = useState("");
    const [repass, setRepassword] = useState("");

    const userdata = JSON.parse(sessionStorage.getItem('usdt'));

    const updatepassword = async () => {
        if (!newpass || !repass) {
            Swal.fire({
                icon: 'warning',
                text: 'กรุณากรอกรหัสผ่านใหม่'
            });
        } else if (newpass !== repass) {
            Swal.fire({
                icon: 'warning',
                text: 'รหัสผ่านใหม่ไม่ตรงกัน'
            });
        } else if (newpass.length < 6) {
            Swal.fire({
                icon: 'warning',
                text: 'รหัสผ่านต้องมากกว่า 6 ตัวอักษร'
            });
        } else {
            const data = {
                EmID: userdata.EmID,
                Password: newpass
            };
            try {
                const response = await postData(`${process.env.NEXT_PUBLIC_API_URL}/login/updatepassword`, data);
                if (response.status === 200) {
                    Swal.fire({
                        icon: 'success',
                        text: 'เปลี่ยนรหัสผ่านสำเร็จ'
                    });
                    setOldpassword("");
                    setNewpassword(""); 
                    setRepassword("");
                } else {
                    Swal.fire({
                        icon: 'error',
                        text: 'เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน'
                    });
                }
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    text: 'เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์'
                });
                console.error('Error updating password:', error);
            }
        }
    }

    const checkoldpassword = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    EmID: userdata.EmID,
                    Password: oldpass
                })
            });
            const data = await response.json();
            if (data.status === 200) {
                updatepassword();
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: 'รหัสผ่านเดิมไม่ถูกต้อง'
                });
                console.error('Login failed:', response.statusText);
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                text: 'เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์'
            });
            console.error('Error checking old password:', error);
        }
    }

    useEffect(() => {
        console.log('====================================');
        console.log(userdata.EmID);
        console.log('====================================');
    }, [userdata]);

    return (
        <div className="mt-5 justify-center items-center text-black">
            <div className="text-black text-2xl font-semibold">
                เปลี่ยนรหัสผ่าน
            </div>
            <div>
                <label className="mr-2">รหัสผ่านเดิม :</label>
                <input
                    type="password"
                    id="oldpassword"
                    placeholder="รหัสผ่านเดิม"
                    value={oldpass}
                    onChange={(e) => setOldpassword(e.target.value)}
                />
            </div>
            <div>
                <label className="mr-2">รหัสผ่านใหม่ :</label>
                <input
                    type="password"
                    id="newpassword"
                    placeholder="รหัสผ่านใหม่"
                    value={newpass}
                    onChange={(e) => setNewpassword(e.target.value)}
                />
            </div>
            <div>
                <label className="mr-2">รหัสผ่านใหม่ :</label>
                <input
                    type="password"
                    id="retypepassword"
                    placeholder="รหัสผ่านใหม่"
                    value={repass}
                    onChange={(e) => setRepassword(e.target.value)}
                />
            </div>
            <div className="flex">
                <button onClick={checkoldpassword} className="w-11/12 bg-yellow-300 text-black"><FaKey className="mr-2" />เปลี่ยนรหัสผ่าน</button>
            </div>
        </div>
    );
}

export default ChangePassword;

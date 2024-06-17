"use client";
import Image from "next/image";
import saber from "@/public/saber.png";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { PostData } from "../utils/Datahandling";

export default function Login() {


    const router = useRouter();
    const [emid, setEmid] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();
    
        try {
            const response = await PostData(`${process.env.NEXT_PUBLIC_API_URL}user/login`, { EmID: emid, Password: password });
            const res = await response
            
            if(res.status === 200){
                localStorage.setItem("userData", JSON.stringify(res.userData));
                router.push(`./${res.userData.Role}`);
            }

            handleErrorResponse(res.status)
            console.log('====================================');
            console.log(res.userData.Role);
            console.log('====================================');
            // if (response.ok) {
            //     // กรณีสำเร็จ
            //     if (response.status === 200) {
            //         const data = await response.json();
            //         
            //         router.push(`./${data.Role}`);
            //     } else {
            //         // กรณีเกิดข้อผิดพลาดที่เซิร์ฟเวอร์ API ส่งกลับมา
            //         handleErrorResponse(response.status);
            //     }
            // } else {
            //     // กรณีที่เซิร์ฟเวอร์ API ไม่สามารถตอบกลับได้
            //     throw new Error("API call failed");
            // }
        } catch (error) {
            setErrorMessage(error.message || "Login failed");
        }
    };
    

    const handleErrorResponse = (status) => {
        switch (status) {
            case 200:
                Swal.fire({
                    title: "เข้าสู่ระบบสำเร็จ",
                    text: "",
                    icon: "success",
                });
                break;
            case 400:
                Swal.fire({
                    title: "เกิดข้อผิดพลาด",
                    text: "รหัสผ่านผิด",
                    icon: "warning",
                });
                break;
            case 404:
                Swal.fire({
                    title: "เกิดข้อผิดพลาด",
                    text: "ไม่พบผู้ใช้",
                    icon: "warning",
                });
                break;
            default:
                Swal.fire({
                    title: "เกิดข้อผิดพลาด",
                    text: "เกิดข้อผิดพลาดในการเข้าสู่ระบบ",
                    icon: "error",
                });
                break;
        }
    };

    return (
        <main className="flex min-h-screen flex-col items-center p-24">
            <div>
                <Image src={saber} width={200} height={200} alt="Saber" />
            </div>
            <div className="card flex-row items-center mt-6">
                <form onSubmit={handleSubmit}>
                    <div>
                        <input
                            type="text"
                            value={emid}
                            placeholder="รหัสพนักงาน"
                            aria-label="รหัสพนักงาน"
                            onChange={(event) => setEmid(event.target.value)}
                            required
                            className="text-black"
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            value={password}
                            placeholder="********"
                            aria-label="Password"
                            onChange={(event) => setPassword(event.target.value)}
                            required
                            className="text-black"

                        />
                    </div>
                    {errorMessage && (
                        <div className="text-red-500">{errorMessage}</div>
                    )}
                    <div className="flex justify-center">
                        <button type="submit" className="bg-blue-600 text-white">
                            ลงชื่อเข้าใช้
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}

'use client'
import Image from "next/image";
import { FaUnlock } from "react-icons/fa";
import saber from '@/public/saber.png'
import { useState } from "react";
import Swal from "sweetalert2";
import { useRouter } from 'next/navigation'


function Login() {
    const router = useRouter()

    const [emid, setEmid] = useState('')
    const [password, setPassword] = useState('')

    const handlelogin = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    EmID: emid,
                    Password: password
                })
            });
            const data = await response.json();
            if (data.status === 200) {
                sessionStorage.setItem('usdt', JSON.stringify(data.userData))
                router.push(`${process.env.NEXT_PUBLIC_BASE_URL}/${data.userData.Role}`)

                // Handle successful login, e.g., save token, redirect, etc.
                console.log('Login successful:', data);
            } else {
                // Handle login failure
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: data.error
                })
                console.error('Login failed:', response.statusText);
            }
        } catch (error) {
            // Handle network or other errors
            console.error('Error during login:', error);
        }
    }

    return (
        <card>
            <form onSubmit={handlelogin}>
                <div className="flex justify-center items-center mb-3">
                    <Image
                        src={saber}
                        height={150}
                        width={'auto'}
                        alt=""
                    />

                </div>
                <div>
                    <input
                        type="text"
                        placeholder="รหัสพนักงาน"
                        value={emid}
                        onChange={(e) => setEmid(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <input
                        type="text"
                        placeholder="รหัสผ่าน"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="flex justify-center">
                    <button className="bg-green-700 text-white"><FaUnlock className="mr-2" />เข้าใช้งาน</button>
                </div>
            </form>
        </card>
    );
}

export default Login;
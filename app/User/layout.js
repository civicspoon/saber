"use client"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Sidebar from "./components/Sidebar";

export default function adminlayout({ children }) {
    const router = useRouter();

    const [role, setRole] = useState(null)
    const [division, setDivision] = useState(null)


    useEffect(() => {
        const data = (localStorage.getItem('userData'))
        const Role = (JSON.parse(data).Role)
        setDivision(JSON.parse(data).DivisionAccess)
setRole(role)
        if (Role !== 'User') {
            router.push('./')
        }

    }, [])
    return (
        <div className="flex-1 bg-gray-900 h-screen p-2                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    ">

            <div className="flex w-full">
                <div className="w-32 h-screen  p-2 text-gray-200">
                    <Sidebar menuaccess={division} />
                </div>
                <div className="bg-white flex w-full m-5 rounded-3xl p-10">
                    {children}
                </div>

            </div>

        </div>
    )
}
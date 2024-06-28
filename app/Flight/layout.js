"use client"
import { useEffect, useState } from "react";
import {useRouter} from "next/navigation";
import Navbar from "./Components/Navbar";

export default function Layout({ children }) {
    const router = useRouter()
    const [sessiondata, setSessiondata] = useState("");

    useEffect(() => {
        setSessiondata(JSON.parse(sessionStorage.getItem('usdt')));
    }, []);

    useEffect(() => {
        if (sessiondata && sessiondata.Role !== 'Flight') {
            router.push("./");
        }
    }, [sessiondata]);

    return (
        <section>
            <Navbar />
            <div className="flex-1 mt-20 m-5">
                {children}
            </div>
        </section>
    );
}

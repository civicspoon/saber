"use client"
import { useEffect, useState } from "react";
import {useRouter} from "next/navigation";
import Navbar from "./Components/Navbar";
import "../globals.css";

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
        <section className="flex h-screen">
            <Navbar />
            <div className=" mt-20 m-5">
                {children}
            </div>
        </section>
    );
}

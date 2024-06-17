"use client";
import { useState } from "react";
import Image from "next/image";
import saber from "@/public/saber.png";
import { FaCog, FaHome, FaRegEnvelope, FaUserSecret } from "react-icons/fa"; // Example of importing icons
import { usePathname } from "next/navigation";

function Sidebar({ menuaccess }) {
    const path = usePathname();

    const menuItems = [
        {
            Name: "Home",
            Link: "/User",
            Icon: FaHome, // Correct usage of icon component
        },
        {
            Name: "Inad",
            Link: "/User/inad",
            Icon: FaUserSecret, // Correct usage of icon component
        },
        {
            Name: "Report",
            Link: "/User/report",
            Icon: FaRegEnvelope, // Correct usage of icon component
        },
        {
            Name: "Setting",
            Link: "/User/setting",
            Icon: FaCog, // Correct usage of icon component
        },
    ];

    const menuset = JSON.parse(menuaccess);

    return (
        <div className="flex flex-col p-2 w-full h-auto items-center justify-center text-gray-400">
            <Image src={saber} height={200} width="auto" alt="Saber Image" />

            <div id="menu" className="flex-1 w-full pt-10">
                {menuItems.map((menu, key) => (
                    <div
                        key={key}
                        className={`my-2 p-2 rounded-lg hover:text-yellow-600 hover:bg-white flex items-center ${path === menu.Link ? 'bg-gray-200 text-black' : ''}`}
                    >
                        <a href={menu.Link} className="text-lg flex items-center w-full">
                            <menu.Icon className="mr-2" />
                            {menu.Name}
                        </a>
                    </div>
                ))}
            </div>

        </div>
    );
}

export default Sidebar;

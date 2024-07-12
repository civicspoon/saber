// app/admin/layout.js
import { Inter } from "next/font/google";
import "../globals.css";
import AdminNavbar from "./Components/AdminNavbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "Admin Dashboard",
    description: "Admin Panel for managing application settings",
};

export default function AdminLayout({ children }) {
    return (
        <html lang="en">
            <body className={`flex-1 bg-white text-gray-800`} style={{ background: 'white', color: 'black' }}>
                <AdminNavbar />
                <div className="mt-20 p-5">
                    {children}
                </div>

            </body>
        </html>
    );
}

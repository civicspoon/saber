import { deleteData, getData } from "@/app/utils/RequestHandle";
import { useState, useEffect } from "react";
import { FaSearch, FaEdit, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import AirlineSelect from "./AirlineSelect";
import { YYYmmdd, convertDateToThaiFormat, formatDate } from "@/app/utils/DateTimeConversion";

const InadRecords = () => {
  const [records, setRecords] = useState([]);
  const [airline, setAirline] = useState("");
  const [flight, setFlight] = useState("");
  const [startDate, setStartDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [departmentId, setDepartmentId] = useState(""); // Replace with actual department ID
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7)); // Default to current month in YYYY-MM format
  const sessiondata = sessionStorage.getItem('usdt') ? JSON.parse(sessionStorage.getItem('usdt')) : null;
  const [uid, setUid] = useState('');

  useEffect(() => {
    if (sessiondata && sessiondata.EmID) {
      setUid(sessiondata.EmID);
      setDepartmentId(sessiondata.DepartmentID);
    }
  }, [sessiondata]);

  useEffect(() => {
    fetchRecords();
  }, [departmentId, month, airline, currentPage]);

  const handleAirlineSelect = (selectedValue) => {
    setAirline(selectedValue);
    console.log('Selected Airline:', selectedValue);
  };

  const fetchRecords = async () => {
    try {
      const params = new URLSearchParams({
        page: currentPage,
        limit: 10,
      });

      const url = `${process.env.NEXT_PUBLIC_API_URL}/inadhandling/pagination/${departmentId}/${month}${airline ? `/${airline}` : ''}?${params}`;
      console.log('Fetching URL:', url);
      const response = await getData(url);
      const data = await response;
      console.log('Fetched Data:', data);
      setRecords(data.records);
      setTotalPages(Math.ceil(data.total / 10));
    } catch (error) {
      console.error("Error fetching records:", error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchRecords();
  };

  const handleEdit = (recordId) => {
    Swal.fire({
      title: "แก้ไขรายการ",
      text: `คุณต้องการแก้ไขรายการ ${recordId} หรือไม่?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "แก้ไข",
    }).then((result) => {
      if (result.isConfirmed) {
        // Add your edit logic here
        console.log("แก้ไขรายการ:", recordId);
      }
    });
  };

  const handleDelete = async (recordId) => {
    Swal.fire({
      title: "ลบรายการ",
      text: "คุณแน่ใจว่าต้องการลบรายการนี้หรือไม่?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ลบ",
      cancelButtonText: "ยกเลิก",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await deleteData(`${process.env.NEXT_PUBLIC_API_URL}/inadhandling/delete/${recordId}`);

        if (response.status === 200) {
          Swal.fire("ลบสำเร็จ!", "รายการของคุณถูกลบแล้ว", "success");
          fetchRecords();
        } else {
          Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถลบรายการนี้ได้", "error");
        }
      }
    });
  };

  return (
    <div >
      <div className="header-primary mt-2">รายการดำเนินการ</div>
      <form onSubmit={handleSearch} className="flex items-center space-x-2 mb-4">
        <AirlineSelect onAirlineSelect={handleAirlineSelect} />
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="border p-2 rounded mt-8"
        />
        <button type="submit" className="btn-yellow mt-8">
          <FaSearch size={18} className="mr-2" /> ค้นหา
        </button>
      </form>

      <div>
      {records.length > 0 ? (
  records.map((record, index) => (
    <div key={index} className="border p-2 mb-2 rounded flex justify-between items-center">
      <div>
        {/* Render the record details here */}
        <div><span className="font-semibold">วันที่</span>: {convertDateToThaiFormat(record.FltDate)} </div>
        <div>
          <span className="font-semibold">สายการบิน:</span> {record.Name} 
          <span className="font-semibold"> เที่ยวบินที่ :</span> {record.IATACode}{record.FlightNo} 
          <span className="font-semibold"> ผู้โดยสาร :</span> {record.Passenger}
        </div>
        <div><span className="font-semibold">เข้า</span>: {record.TimeIn.slice(0, -3)} <span className="font-semibold">ออก</span>: {record.TimeOut.slice(0, -3)} <span className="font-semibold">เวลาดำเนินการ</span>: {record.Diff.slice(0, -3)}</div>
        <div><span className="font-semibold">หมายเหตุ</span>:OUTBOUND {record.outflight} <br/>{ formatDate(record.outdate)} </div>
        <div><span className="font-semibold">ผู้บันทึก : </span> {record.UName} {record.UpdatedAt} 
          {record.UName > record.UName ? record.UName : null} {/* This is corrected */}
        </div>
      </div>
      <div className="flex space-x-2">
        <button onClick={() => handleEdit(record.id)} className="btn-yellow flex items-center">
          <FaEdit className="mr-2" /> แก้ไข
        </button>
        <button onClick={() => handleDelete(record.id)} className="btn-red flex items-center">
          <FaTrash className="mr-2" /> ลบ
        </button>
      </div>
    </div>
  ))
) : (
  <div className="flex bg-red-400 text-center text-white">ไม่พบรายการ</div>
)}

      </div>

      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="btn-gray"
        >
          ก่อนหน้า
        </button>
        <span>
          หน้า {currentPage} จาก {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="btn-gray"
        >
          ถัดไป
        </button>
      </div>
    </div>
  );
};

export default InadRecords;

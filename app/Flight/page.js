"use client"
import Modal from "../Components/Modal";
import StackedIcons from "../Components/StackedIcons";
import InsertInad from "./Components/InsertInad";
import { useState } from 'react';
import { FaPlus, FaSave } from 'react-icons/fa'; // นำเข้าไอคอนที่ต้องการใช้
import { LuPlane, LuPlaneLanding } from "react-icons/lu";
import NewFlight from "./Components/NewFlight";
import NewAirline from "./Components/NewAirline";
import Guide from "./Components/Guide";

function Page() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNewFlightOpen, setIsNewFlightOpen] = useState(false);
  const [isNewFlight, setIsNewFlight] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
    setIsNewFlight(false);
  };

  const openFlightModal = () => {
    setIsModalOpen(true);
    setIsNewFlight(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsNewFlight(false);
  };

  return (
    <>
        <div className="font-semibold bg-blue-700 text-2xl p-4 rounded-t-lg">เพิ่มรายการ สายการบิน-เที่ยวบิน</div>
        <div className="flex justify-between  p-2 rounded-b-lg mb-4 bg-slate-700">

          <button
            className="bg-blue-500 text-white px-4 pl-6 py-2 rounded flex items-center"
            onClick={openModal}
          >
            <StackedIcons
              icons={[LuPlane, FaPlus]}
              sizes={['text-4xl', 'text-xl']}
              colors={['text-white', 'text-white']}
              positions={['', 'top-2 right-8']}
            /> เพิ่มสายการบิน
          </button>

          <button
            className="bg-blue-500 text-white px-4 pl-6 py-2 rounded flex items-center ml-4"
            onClick={openFlightModal}
          >
            <StackedIcons
              icons={[LuPlaneLanding, FaPlus]}
              sizes={['text-4xl', 'text-xl']}
              colors={['text-white', 'text-white']}
              positions={['', 'top-2 right-8']}
            /> เพิ่มเที่ยวบิน
          </button>
        </div>
      <div>
        <div className="font-semibold bg-blue-700 text-2xl p-4 rounded-t-lg">เพิ่มข้อมูล INAD AOTGA</div>
        <div className="flex bg-slate-700 p-4 rounded-lg shadow-black shadow-sm">
          <InsertInad />
        </div>
        <div>
          <Guide />
        </div>
       
      </div>

      {/* MODAL */}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        {isNewFlight ? <NewFlight /> : <NewAirline />}
      </Modal>
    </>
  );
}

export default Page;

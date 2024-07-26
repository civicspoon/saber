"use client"
import React, { useState, useEffect } from 'react';
import MonthDashboard from '@/app/Admin/Components/MonthDashboard';
import WhatDocDashboard from '@/app/Admin/WhatDoc/Components/WhatDocDashboard';

const Page = () => {
  const [userdata, setUserdata] = useState(null);
  const [divisionAccess, setDivisionAccess] = useState([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const user = JSON.parse(sessionStorage.getItem('usdt'));
      setUserdata(user);
      setDivisionAccess(JSON.parse(user?.DivisionAccess || '[]'));
    }
  }, []);

  const DashboardItemList = [
    {
      component: MonthDashboard,
      label: 'AOTGA Services',
      division: 3
    },
    {
      component: WhatDocDashboard,
      label: 'WhatDoc',
      division: 1
    }
  ];

  const filteredDashboardItems = DashboardItemList.filter(item => item.division === 0 || divisionAccess.includes(item.division));

  return (
    <div className="flex justify-center min-h-screen">
      <div className="p-4 w-full max-w-4xl">
        {filteredDashboardItems.map((item, index) => {
          const Component = item.component;
          return (
            <div key={index} className="flex w-full flex-col items-center mb-6">
              <span className="p-2 bg-gray-300 text-black shadow-lg rounded-md w-full mb-2 mt-2 text-lg font-semibold text-center">
                {item.label}
              </span>
              <div className="w-full">
                <Component />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Page;

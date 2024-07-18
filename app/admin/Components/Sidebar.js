// components/Sidebar.js
'use client'
import React, { useState } from 'react';
import { FaHome, FaCalendar, FaInbox } from 'react-icons/fa';

// Sample session data
const sessionData = {
  "EmID": "11",
  "Name": "User admin",
  "DepartmentID": 5,
  "DivisionAccess": "[3,4]",
  "Role": "Admin"
};

// Parse the DivisionAccess values
const divisionAccess = JSON.parse(sessionData.DivisionAccess);

const Sidebar = () => {
  const [hovered, setHovered] = useState(null);

  const handleHover = (icon) => {
    setHovered(icon);
  };

  const handleHoverExit = () => {
    setHovered(null);
  };

  const sidebarItems = [
    { icon: FaHome, label: 'Dashboard', link: '/dashboard', division: 1 },
    { icon: FaCalendar, label: 'Calendar', link: '/ViewForCheck', division: 2 },
    { icon: FaInbox, label: 'Inbox', link: '/inbox', division: 3 },
    { icon: FaInbox, label: 'Team', link: '/team', division: 3 },
    { icon: FaInbox, label: 'Projects', link: '/projects', division: 4 },
  ];

  // Filter sidebar items based on DivisionAccess
  const filteredSidebarItems = sidebarItems.filter(item => divisionAccess.includes(item.division));

  return (
    <aside className="bg-gray-800 text-gray-300 w-auto py-4">
      <ul>
        {filteredSidebarItems.map((item, index) => {
          const Icon = item.icon;
          const isHovered = hovered === Icon;

          return (
            <li
              key={index}
              className="group flex items-center px-6 py-2 cursor-pointer transition-all duration-300 hover:bg-gray-700"
              onMouseEnter={() => handleHover(Icon)}
              onMouseLeave={handleHoverExit}
            >
              <Icon className={`h-6 w-6 mr-4 ${isHovered ? 'scale-125' : 'scale-100'}`} />
              <span className="truncate">{item.label}</span>
            </li>
          );
        })}
      </ul>
    </aside>
  );
};

export default Sidebar;

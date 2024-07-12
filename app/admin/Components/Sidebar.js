// components/Sidebar.js
'use client'
FaHome
import React from 'react';
import { useState } from 'react';

import { FaHome,FaCalendar,FaInbox } from 'react-icons/fa';

const Sidebar = () => {
  const [hovered, setHovered] = useState(null);

  const handleHover = (icon) => {
    setHovered(icon);
  };

  const handleHoverExit = () => {
    setHovered(null);
  };

  const sidebarItems = [
    { icon: FaHome, label: 'Dashboard', link: '/dashboard' },
    { icon: FaCalendar, label: 'Calendar', link: '/calendar' },
    { icon: FaInbox, label: 'Inbox', link: '/inbox' },
    { icon: FaInbox, label: 'Team', link: '/team' },
    { icon: FaInbox, label: 'Projects', link: '/projects' },
  ];

  return (
    <aside className="bg-gray-800 text-gray-300 w-auto+-+
    ++ py-4">
      <ul>
        {sidebarItems.map((item, index) => {
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

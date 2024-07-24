'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaHome, FaCalendar, FaInbox } from 'react-icons/fa';

const Sidebar = () => {
  const basUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const router = useRouter();
  const [userdata, setUserdata] = useState(null);
  const [divisionAccess, setDivisionAccess] = useState([]);
  const [hovered, setHovered] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const user = JSON.parse(sessionStorage.getItem('usdt'));
      setUserdata(user);
      setDivisionAccess(JSON.parse(user?.DivisionAccess || '[]'));
    }
  }, []);

  const handleHover = (icon) => {
    setHovered(icon);
  };

  const handleHoverExit = () => {
    setHovered(null);
  };

  const sidebarItems = [
    { icon: FaHome, label: 'Dashboard', link: `${basUrl}/Admin`, division: 3 },
    { icon: FaCalendar, label: 'Calendar', link: './ViewForCheck', division: 1 },
    { icon: FaInbox, label: 'Inbox', link: './inbox', division: 1 },
    { icon: FaInbox, label: 'Team', link: './team', division: 1 },
    { icon: FaInbox, label: 'Projects', link: './projects', division: 1 },
  ];

  // Filter sidebar items based on DivisionAccess
  const filteredSidebarItems = sidebarItems.filter(item => divisionAccess.includes(item.division));

  const handleNavigation = (link) => {
    router.push(link);
  };

  if (!userdata) {
    return null; // or a loading indicator
  }

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
              onClick={() => handleNavigation(item.link)}
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

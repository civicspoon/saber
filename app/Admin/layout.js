// components/layout.js
import React from 'react';
import Sidebar from './Components/Sidebar';

const Layout = ({ children }) => {
  return (
    <div className="flex h-screen bg-white">
      <Sidebar />
      <main className="flex-1 h-full overflow-auto">
        {children}
      </main>
    </div>
  );
};

export default Layout;

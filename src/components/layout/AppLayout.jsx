import React, { useState } from 'react';
import Sidebar from '../common/Sidebar/Sidebar';
import Topbar from '../common/Topbar/Topbar';

const AppLayout = ({ children, userRole }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="h-screen flex bg-gray-50 font-sans text-gray-800">
      {sidebarOpen && <Sidebar userRole={userRole} />}
      <div style={{ overflow: 'auto' }} className="flex-1 flex flex-col">
        <Topbar onToggleSidebar={() => setSidebarOpen((s) => !s)} />
        <main className="flex-1 overflow-auto p-4">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;

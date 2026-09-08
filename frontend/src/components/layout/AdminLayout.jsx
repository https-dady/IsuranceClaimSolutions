import { useState } from "react";

import AdminSidebar from "../admin/AdminSidebar";
import AdminHeader from "../admin/AdminHeader";

import { currentUser } from "../../utils/currentUser";

function AdminLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      
      {/* Sidebar */}
      <AdminSidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        role={currentUser.role}
      />

      {/* Main Content */}
      <div className="lg:pl-72">
        
        {/* Header */}
        <AdminHeader
          setIsSidebarOpen={setIsSidebarOpen}
          role={currentUser.role}
          adminName={currentUser.name}
        />

        {/* Page */}
        <main className="min-h-[calc(100vh-80px)] p-5 sm:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
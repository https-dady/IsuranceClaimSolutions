import { useState } from "react";

import AdminSidebar from "../admin/AdminSidebar";
import AdminHeader from "../admin/AdminHeader";

import { useAuth } from "../../context/AuthContext";

function AdminLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminSidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      <div className="lg:pl-72">
        <AdminHeader
          setIsSidebarOpen={setIsSidebarOpen}
          role={user?.role}
          adminName={user?.name}
        />

        <main className="min-h-[calc(100vh-80px)] p-5 sm:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;

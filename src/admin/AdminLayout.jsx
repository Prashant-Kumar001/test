import React from "react";
import SideBar from "./SideBar";

const AdminLayout = ({ children }) => {
  return (
    <div className="flex h-screen w-full bg-gray-100 overflow-hidden">
      <SideBar />
      <div className="flex-1 overflow-y-auto p-6">
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;

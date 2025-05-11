import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ImStatsDots,
  ImPieChart,
} from "react-icons/im";
import {
  AiOutlineUser,
  AiOutlineShopping,
  AiOutlineBarChart,
  AiOutlinePlus,
  AiOutlineMenu,
  AiOutlineClose,
  AiOutlineLineChart,
} from "react-icons/ai";
import { BiScatterChart } from "react-icons/bi";

const SideBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navSections = [
    {
      heading: "Dashboard",
      links: [
        {
          path: "/admin",
          label: "Overview",
          icon: <ImStatsDots size={20} />,
        },
      ],
    },
    {
      heading: "Management",
      links: [
        { path: "/admin/users", label: "Users", icon: <AiOutlineUser size={20} /> },
        { path: "/admin/orders", label: "Orders", icon: <AiOutlineShopping size={20} /> },
        { path: "/admin/manage", label: "Manage", icon: <AiOutlinePlus size={20} /> },
        { path: "/admin/create", label: "Create", icon: <AiOutlinePlus size={20} /> },
      ],
    },
    {
      heading: "Charts & Insights",
      links: [
        { path: "/admin/pie", label: "Pie Chart", icon: <ImPieChart size={20} /> },
        { path: "/admin/line", label: "Line Chart", icon: <AiOutlineLineChart size={20} /> },
        { path: "/admin/bar", label: "Bar Chart", icon: <BiScatterChart size={20} /> },
      ],
    },
  ];

  return (
    <>
      {/* Toggle Button */}
      <button
        className="absolute top-4 left-4 z-50 p-2 rounded-lg md:hidden bg-white shadow"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <AiOutlineClose size={22} /> : <AiOutlineMenu size={22} />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed font-ubuntu md:sticky top-0 left-0 z-40 h-screen bg-white w-64 md:w-1/5 p-6 shadow-md transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="mb-8 text-2xl font-bold text-indigo-700">Admin Panel</div>

        <div className="space-y-6">
          {navSections.map((section) => (
            <div key={section.heading}>
              <h4 className="text-xs font-bold text-gray-500 uppercase mb-2 px-2">{section.heading}</h4>
              <div className="flex flex-col gap-2">
                {section.links.map((link) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-all ${
                        isActive
                          ? "bg-indigo-100 text-indigo-700 font-semibold"
                          : "hover:bg-gray-100 text-gray-700"
                      }`}
                    >
                      {link.icon}
                      <span>{link.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Backdrop on mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default SideBar;

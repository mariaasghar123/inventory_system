import React from "react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  FaBox,
  FaCashRegister,
  FaMoneyBill,
  FaShoppingBag,
  FaPlus,
} from "react-icons/fa";
import LiveChart from "./LiveChart";

// ✅ Centralized Base URL
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function DashboardHome() {
  const [recentActivities, setRecentActivities] = useState([]);

  // fetch recent activities from backend
  const fetchActivities = () => {
    fetch(`${BASE_URL}/api/dashboard/recent-activities`)
      .then((res) => res.json())
      .then((data) => setRecentActivities(data))
      .catch((err) => console.error("Recent activities fetch error:", err));
  };

  useEffect(() => {
    fetchActivities(); // load on mount
    const interval = setInterval(fetchActivities, 10000); // refresh every 10 sec
    return () => clearInterval(interval); // cleanup
  }, []);

  // cards
  const cards = [
    {
      title: "Products",
      desc: "All items",
      icon: <FaBox className="text-white text-4xl mb-3" />,
      link: "/products",
      bgColor: "bg-blue-800",
      hoverColor: "hover:bg-blue-700",
    },
    {
      title: "Sales",
      desc: "Your total sales",
      icon: <FaCashRegister className="text-white text-4xl mb-3" />,
      link: "/sales",
      bgColor: "bg-green-500",
      hoverColor: "hover:bg-green-400",
    },
    {
      title: "Expenses",
      desc: "Track costs",
      icon: <FaMoneyBill className="text-white text-4xl mb-3" />,
      link: "/expenses",
      bgColor: "bg-yellow-900",
      hoverColor: "hover:bg-yellow-800",
    },
    {
      title: "Purchases",
      desc: "Manage purchases",
      icon: <FaShoppingBag className="text-white text-4xl mb-3" />,
      link: "/purchases",
      bgColor: "bg-purple-700",
      hoverColor: "hover:bg-purple-600",
    },
  ];

  return (
    <div className="space-y-10">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Welcome to My Inventory Dashboard</h1>
        <p className="text-gray-600">Quick overview of your inventory system.</p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <Link
            key={i}
            to={card.link}
            className={`${card.bgColor} ${card.hoverColor} p-6 rounded-xl shadow transform hover:scale-105 transition duration-300 flex flex-col items-center text-center`}
          >
            {card.icon}
            <h2 className="text-xl font-semibold mb-1 text-white">{card.title}</h2>
            <p className="text-white/90">{card.desc}</p>
          </Link>
        ))}
      </div>

      {/* Live Chart */}
      <LiveChart />

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Link
            to="/products/new"
            className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700"
          >
            <FaPlus /> Add Product
          </Link>
          <Link
            to="/sales/new"
            className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-green-700"
          >
            <FaPlus /> New Sale
          </Link>
          <Link
            to="/expenses/new"
            className="bg-yellow-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-yellow-700"
          >
            <FaPlus /> Add Expense
          </Link>
          <Link
            to="/purchases/new"
            className="bg-purple-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-purple-700"
          >
            <FaPlus /> New Purchase
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-100">
              <th className="text-left px-4 py-2">Action</th>
              <th className="text-left px-4 py-2">Time</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(recentActivities) &&
              recentActivities.map((activity, index) => (
                <tr key={index} className="border-b">
                  <td className="px-4 py-2">{activity.action}</td>
                  <td className="px-4 py-2 text-gray-500">
                    {new Date(activity.time).toLocaleString()}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        {recentActivities.length === 0 && (
          <p className="text-gray-500 mt-2">No recent activities yet.</p>
        )}
      </div>
    </div>
  );
}

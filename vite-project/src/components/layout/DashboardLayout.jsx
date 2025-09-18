// src/layouts/DashboardLayout.jsx
import { Link, Outlet, useNavigate } from "react-router-dom";
import { 
  FaBox, FaUsers, FaCashRegister, FaList, 
  FaTruck, FaMoneyBill, FaShoppingBag, FaUndo , FaHome
} from "react-icons/fa";
import { useEffect } from "react";

export default function DashboardLayout() {
  const navigate = useNavigate();

  // ✅ currentUser localStorage se parse karo
  const currentUser = JSON.parse(localStorage.getItem("user"));

  // logout handler
  const handleLogout = () => {
    localStorage.removeItem("token"); // token delete
    localStorage.removeItem("user");  // user delete
    navigate("/login"); // login page pe bhejo
  };

  // ✅ agar token hi na ho to login pe bhej do
  useEffect(() => {
    const token = localStorage.getItem("token");
    // sirf tab check kare jab user protected page par hai (ye layout sirf protected pages pe hai)
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-600 text-white flex flex-col">
        <Link
          to="/"
          className="text-white text-3xl font-bold p-4 border-b border-blue-500"
        >
          My Inventory
        </Link>
        {/* Navigation Links */}
        <nav className="flex-1 p-4 space-y-2">
          <Link to="/" className="flex items-center gap-2 hover:bg-blue-500 px-3 py-2 rounded">
            <FaHome /> Home
          </Link>
          <Link to="/products" className="flex items-center gap-2 hover:bg-blue-500 px-3 py-2 rounded">
            <FaBox /> Products
          </Link>
          <Link to="/users" className="flex items-center gap-2 hover:bg-blue-500 px-3 py-2 rounded">
            <FaUsers /> Users
          </Link>
          <Link to="/sales" className="flex items-center gap-2 hover:bg-blue-500 px-3 py-2 rounded">
            <FaCashRegister /> Sales
          </Link>
          <Link to="/salesitem" className="flex items-center gap-2 hover:bg-blue-500 px-3 py-2 rounded">
            <FaList /> Sale Items
          </Link>
          <Link to="/stockbatches" className="flex items-center gap-2 hover:bg-blue-500 px-3 py-2 rounded">
            <FaTruck /> Stock Batches
          </Link>
          
          <Link to="/purchases" className="flex items-center gap-2 hover:bg-blue-500 px-3 py-2 rounded">
            <FaShoppingBag /> Purchases
          </Link>
          <Link to="/purchaseitems" className="flex items-center gap-2 hover:bg-blue-500 px-3 py-2 rounded">
            <FaList /> Purchase Items
          </Link>
          <Link to="/returns" className="flex items-center gap-2 hover:bg-blue-500 px-3 py-2 rounded">
            <FaUndo /> Returns
          </Link>

          {/* ✅ Profit & Loss sirf admin ko */}
         {currentUser?.role === "admin" && (
  <div className="flex flex-col gap-1">
    <Link
      to="/expenses"
      className="flex items-center gap-2 hover:bg-blue-500 px-3 py-2 rounded"
    >
      <FaMoneyBill /> Expenses
    </Link>
    <Link
      to="/profit-loss"
      className="flex items-center gap-2 hover:bg-blue-500 px-3 py-2 rounded"
    >
      <FaBox /> Profit & Loss
    </Link>
  </div>
)}

        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* 🔹 Topbar */}
        <header className="bg-white shadow p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Dashboard</h1>

          <div className="flex items-center gap-4">
            {localStorage.getItem("token") ? (
              // ✅ Agar token hai to logout dikhai do + role text
              <>
                <span className="text-gray-600 capitalize">
                  {/* ✅ role dynamically dikhana */}
                  {currentUser?.role === "admin"
                    ? "Admin"
                    : currentUser?.role === "salesman"
                    ? "Salesman"
                    : "User"}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-blue-600 text-white px-3 py-1 rounded"
                >
                  Logout
                </button>
              </>
            ) : (
              // ✅ Agar token nahi hai to login/signup buttons dikhai do
              <>
                <Link
                  to="/login"
                  className="bg-blue-600 text-white px-3 py-1 rounded"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-green-600 text-white px-3 py-1 rounded"
                >
                  Signup
                </Link>
              </>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function SaleList() {
  const [sales, setSales] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/sales`);
      const data = await res.json();
      setSales(data);
    } catch (err) {
      console.error("Error fetching sales:", err);
      alert("❌ Failed to fetch sales");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this sale?")) return;

    try {
      const res = await fetch(`${BASE_URL}/api/sales/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setSales(sales.filter((s) => s.id !== id));
        alert("✅ Sale deleted successfully!");
      } else {
        alert("❌ Failed to delete sale");
      }
    } catch (err) {
      console.error("Error deleting sale:", err);
      alert("❌ An error occurred while deleting the sale");
    }
  };

  const handleEdit = (id) => {
    navigate(`/sales/edit/${id}`);
  };

  const handleNewSale = () => {
    navigate("/sales/new");
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Sales</h1>
          <button
            onClick={handleNewSale}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition"
          >
            + New Sale
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-red-200 uppercase text-sm">
                <th className="p-3 text-left border-b">Invoice No</th>
                <th className="p-3 text-left border-b">Date</th>
                <th className="p-3 text-left border-b">Total</th>
                <th className="p-3 text-left border-b">Discount</th>
                <th className="p-3 text-left border-b">Payment Method</th>
                <th className="p-3 text-left border-b">Created By (User ID)</th>
                <th className="p-3 text-center border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sales.length > 0 ? (
                sales.map((s, index) => (
                  <tr
                    key={s.id}
                    className={`hover:bg-gray-50 ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <td className="p-3 border-b">{s.invoice_no}</td>
                    <td className="p-3 border-b">
                      {new Date(s.date).toLocaleDateString()}
                    </td>
                    <td className="p-3 border-b font-semibold text-gray-800">{s.total}</td>
                    <td className="p-3 border-b">{s.discount}</td>
                    <td className="p-3 border-b">{s.paymentMethod}</td>
                    <td className="p-3 border-b">{s.createdBy}</td>
                    <td className="p-3 border-b">
                      <div className="flex gap-4 justify-center">
                        <button
                          onClick={() => handleEdit(s.id)}
                          className="text-green-500 hover:text-green-700"
                          title="Edit"
                        >
                          <FaEdit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(s.id)}
                          className="text-red-500 hover:text-red-700"
                          title="Delete"
                        >
                          <FaTrash size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center text-gray-500 p-6 border-b">
                    No sales found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function ReturnList() {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch returns
  useEffect(() => {
    async function fetchReturns() {
      try {
        const res = await fetch(`${BASE_URL}/api/returns`);
        if (!res.ok) throw new Error("Failed to fetch returns");
        const data = await res.json();
        setReturns(data);
      } catch (err) {
        console.error(err);
        alert("❌ Failed to load returns");
      } finally {
        setLoading(false);
      }
    }

    fetchReturns();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this return?")) return;

    try {
      const res = await fetch(`${BASE_URL}/api/returns/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete return");
      setReturns(returns.filter((r) => r.id !== id));
      alert("✅ Return deleted successfully!");
    } catch (err) {
      console.error(err);
      alert("❌ Error deleting return");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-gray-500 animate-pulse text-lg">Loading returns...</p>
      </div>
    );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-6">
        {/* Heading + Add Button */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Returns</h1>
          <Link
            to="/returns/new"
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow transition"
          >
            + Add New Return
          </Link>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left border-collapse">
            <thead className="bg-orange-100 text-gray-700 uppercase text-xs tracking-wider">
              <tr>
                <th className="px-4 py-3 border-b">Sale ID</th>
                <th className="px-4 py-3 border-b">Product ID</th>
                <th className="px-4 py-3 border-b">Quantity</th>
                <th className="px-4 py-3 border-b">Reason</th>
                <th className="px-4 py-3 border-b">Refund Amount</th>
                <th className="px-4 py-3 border-b text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {returns.length > 0 ? (
                returns.map((r, index) => (
                  <tr
                    key={r.id}
                    className={`hover:bg-gray-50 ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <td className="px-4 py-3 border-b">{r.saleId}</td>
                    <td className="px-4 py-3 border-b">{r.productId}</td>
                    <td className="px-4 py-3 border-b">{r.qty}</td>
                    <td className="px-4 py-3 border-b">{r.reason}</td>
                    <td className="px-4 py-3 border-b">{r.refundAmount}</td>
                    <td className="px-4 py-3 border-b text-center">
                      <div className="flex items-center justify-center space-x-4">
                        <Link
                          to={`/returns/edit/${r.id}`}
                          className="text-blue-500 hover:text-blue-700 transition"
                          title="Edit"
                        >
                          <FaEdit />
                        </Link>
                        <button
                          onClick={() => handleDelete(r.id)}
                          className="text-red-500 hover:text-red-700 transition"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-6 text-gray-500 text-sm">
                    No return records found.
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

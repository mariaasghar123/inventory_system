import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";

// ✅ Use environment variable for backend URL
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function PurchaseList() {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch all purchases
  useEffect(() => {
    async function fetchPurchases() {
      try {
        const res = await fetch(`${BASE_URL}/api/purchases`);
        if (!res.ok) throw new Error("Failed to fetch purchases");
        const data = await res.json();
        setPurchases(data);
      } catch (err) {
        console.error(err);
        alert("❌ Failed to load purchases");
      } finally {
        setLoading(false);
      }
    }

    fetchPurchases();
  }, []);

  // ✅ Delete a purchase
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this purchase?")) return;
    try {
      const res = await fetch(`${BASE_URL}/api/purchases/${id}`, { method: "DELETE" });
      if (res.ok) {
        setPurchases(purchases.filter((p) => p.id !== id));
        alert("✅ Purchase deleted successfully");
      } else {
        alert("❌ Failed to delete purchase");
      }
    } catch (err) {
      console.error(err);
      alert("❌ Error deleting purchase");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-blue-50">
        <p className="text-gray-500 animate-pulse text-lg">Loading purchases...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 via-white to-blue-50 p-6">
      {/* Heading + Add Button */}
      <div className="max-w-6xl mx-auto flex justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold text-gray-700">Purchases</h1>
        <Link
          to="/purchases/new"
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl shadow-md transition transform hover:scale-[1.02]"
        >
          + Add New Purchase
        </Link>
      </div>

      {/* Table Container */}
      <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden">
        <table className="table-auto w-full border-collapse">
          <thead className="bg-gradient-to-r from-blue-100 to-blue-200">
            <tr>
              <th className="border-b px-4 py-3 text-left font-semibold text-gray-600">
                Invoice No
              </th>
              <th className="border-b px-4 py-3 text-left font-semibold text-gray-600">
                Date
              </th>
              <th className="border-b px-4 py-3 text-left font-semibold text-gray-600">
                Supplier ID
              </th>
              <th className="border-b px-4 py-3 text-left font-semibold text-gray-600">
                Total
              </th>
              <th className="border-b px-4 py-3 text-center font-semibold text-gray-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {purchases.length > 0 ? (
              purchases.map((p, idx) => (
                <tr
                  key={p.id}
                  className={`${
                    idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-blue-50 transition`}
                >
                  <td className="border-b px-4 py-3">{p.invoiceNo}</td>
                  <td className="border-b px-4 py-3">
                    {new Date(p.date).toLocaleDateString()}
                  </td>
                  <td className="border-b px-4 py-3">{p.supplierId}</td>
                  <td className="border-b px-4 py-3 font-semibold text-gray-700">{p.total}</td>
                  <td className="border-b px-4 py-3">
                    <div className="flex items-center justify-center space-x-6">
                      {/* Edit Icon */}
                      <Link
                        to={`/purchases/edit/${p.id}`}
                        className="text-blue-500 hover:text-blue-700 transition"
                      >
                        <FaEdit size={18} />
                      </Link>

                      {/* Delete Icon */}
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="text-red-500 hover:text-red-700 transition"
                      >
                        <FaTrash size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="text-center text-gray-500 py-6 font-medium"
                >
                  No purchases found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

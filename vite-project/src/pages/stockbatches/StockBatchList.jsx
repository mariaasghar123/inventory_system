import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";

// ✅ Environment-based URL
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function StockBatchList() {
  const [batches, setBatches] = useState([]);

  useEffect(() => {
    fetch(`${BASE_URL}/api/stockbatches`)
      .then(res => res.json())
      .then(data => setBatches(data))
      .catch(err => console.error(err));
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this stock batch?")) {
      try {
        const res = await fetch(`${BASE_URL}/api/stockbatches/${id}`, {
          method: "DELETE",
        });

        if (res.ok) {
          setBatches(batches.filter(b => b.id !== id));
        } else {
          alert("Failed to delete stock batch");
        }
      } catch (err) {
        console.error(err);
        alert("Error deleting stock batch");
      }
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      {/* Heading + Add Button */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Stock Batches</h1>
        <Link
          to="/stockbatches/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow-md transition"
        >
          + Add New Stock Batch
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-purple-100">
            <tr>
              <th className="px-4 py-3 border-b text-left">Product ID</th>
              <th className="px-4 py-3 border-b text-left">Batch No</th>
              <th className="px-4 py-3 border-b text-left">Expiry Date</th>
              <th className="px-4 py-3 border-b text-left">Quantity</th>
              <th className="px-4 py-3 border-b text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {batches.map(b => (
              <tr key={b.id} className="hover:bg-gray-50 transition">
                <td className="px-4 py-3 border-b">{b.productId}</td>
                <td className="px-4 py-3 border-b">{b.batch_no}</td>
                <td className="px-4 py-3 border-b">
                  {new Date(b.expiry_date).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 border-b">{b.qty}</td>
                <td className="px-4 py-3 border-b text-center flex justify-center gap-3">
                  <Link
                    to={`/stockbatches/edit/${b.id}`}
                    className="text-green-600 hover:text-green-800 transition"
                    title="Edit"
                  >
                    <FaEdit size={18} />
                  </Link>

                  <button
                    onClick={() => handleDelete(b.id)}
                    className="text-red-600 hover:text-red-800 transition"
                    title="Delete"
                  >
                    <FaTrash size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {batches.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500">
                  No stock batches available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

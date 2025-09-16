import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function PurchaseItemList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch purchase items
  useEffect(() => {
    async function fetchItems() {
      try {
        const res = await fetch(`${BASE_URL}/api/purchaseitems`);
        if (!res.ok) throw new Error("Failed to fetch purchase items");
        const data = await res.json();
        setItems(data);
      } catch (err) {
        console.error(err);
        alert("❌ Failed to load purchase items");
      } finally {
        setLoading(false);
      }
    }
    fetchItems();
  }, []);

  // ✅ Delete purchase item
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      const res = await fetch(`${BASE_URL}/api/purchaseitems/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete item");
      setItems(items.filter((item) => item.id !== id));
      alert("✅ Item deleted successfully");
    } catch (err) {
      console.error(err);
      alert("❌ Error deleting item");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <p className="text-gray-500 animate-pulse text-lg">Loading purchase items...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 space-y-3 md:space-y-0">
          <h1 className="text-3xl font-extrabold text-blue-600">
            Purchase Items
          </h1>
          <Link
            to="/purchaseitems/new"
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-5 py-2 rounded-lg shadow-md transform hover:scale-[1.02] transition duration-200 font-semibold"
          >
            + Add New Purchase Item
          </Link>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-blue-100 text-gray-700 text-left">
                <th className="px-6 py-3 font-semibold">Purchase Invoice</th>
                <th className="px-6 py-3 font-semibold">Product Name</th>
                <th className="px-6 py-3 font-semibold">Quantity</th>
                <th className="px-6 py-3 font-semibold">Cost Price</th>
                <th className="px-6 py-3 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.length > 0 ? (
                items.map((item, idx) => (
                  <tr
                    key={item.id}
                    className={`hover:bg-gray-50 transition ${
                      idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <td className="px-6 py-4 border-b">
                      {item.purchase?.invoiceNo || "-"}
                    </td>
                    <td className="px-6 py-4 border-b">
                      {item.product?.name || "-"}
                    </td>
                    <td className="px-6 py-4 border-b">{item.qty}</td>
                    <td className="px-6 py-4 border-b">{item.costPrice}</td>
                    <td className="px-6 py-4 border-b">
                      <div className="flex justify-center space-x-4">
                        <Link
                          to={`/purchaseitems/edit/${item.id}`}
                          className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-full transition"
                          title="Edit"
                        >
                          <FaEdit />
                        </Link>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-full transition"
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
                  <td
                    colSpan="5"
                    className="text-center py-6 text-gray-500 italic"
                  >
                    No purchase items found.
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

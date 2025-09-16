import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function SaleItemList() {
  const [saleItems, setSaleItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSaleItems();
  }, []);

  const fetchSaleItems = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/saleitems`);
      const data = await res.json();
      setSaleItems(data);
    } catch (err) {
      console.error(err);
      alert("❌ Failed to fetch sale items");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this sale item?")) return;
    try {
      const res = await fetch(`${BASE_URL}/api/saleitems/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setSaleItems(saleItems.filter((item) => item.id !== id));
        alert("✅ Sale item deleted!");
      } else {
        alert("❌ Failed to delete sale item");
      }
    } catch (err) {
      console.error(err);
      alert("❌ Error deleting sale item");
    }
  };

  const handleEdit = (id) => {
    navigate(`/saleitems/edit/${id}`);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Sale Items</h2>
        <button
          onClick={() => navigate("/salesitem/new")}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-lg shadow hover:bg-blue-700 transition-all duration-200"
        >
          + New Sale Item
        </button>
      </div>

      {/* Table container */}
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full text-sm text-left border border-gray-200">
          <thead className="bg-green-100 text-gray-700 uppercase text-xs tracking-wider">
            <tr>
              <th className="p-3 border">ID</th>
              <th className="p-3 border">Sale ID</th>
              <th className="p-3 border">Product ID</th>
              <th className="p-3 border">Qty</th>
              <th className="p-3 border">Price</th>
              <th className="p-3 border">Subtotal</th>
              <th className="p-3 border text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {saleItems.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  className="text-center p-5 text-gray-500 italic"
                >
                  No Sale Items Found
                </td>
              </tr>
            ) : (
              saleItems.map((item, index) => (
                <tr
                  key={item.id}
                  className={`hover:bg-gray-50 ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <td className="p-3 border">{item.id}</td>
                  <td className="p-3 border">{item.saleId}</td>
                  <td className="p-3 border">{item.productId}</td>
                  <td className="p-3 border">{item.qty}</td>
                  <td className="p-3 border">{item.price}</td>
                  <td className="p-3 border">{item.subtotal}</td>
                  <td className="p-3 border">
                    <div className="flex justify-center gap-4">
                      {/* Edit */}
                      <button
                        onClick={() => handleEdit(item.id)}
                        className="text-green-600 hover:text-green-800 transition"
                        title="Edit"
                      >
                        <FaEdit size={18} />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:text-red-800 transition"
                        title="Delete"
                      >
                        <FaTrash size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function PurchaseItemEditForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState({
    purchaseId: "",
    productId: "",
    qty: "",
    costPrice: "",
  });

  const [loading, setLoading] = useState(true);

  // ✅ Fetch existing purchase item
  useEffect(() => {
    async function fetchItem() {
      try {
        const res = await fetch(`${BASE_URL}/api/purchaseitems/${id}`);
        if (!res.ok) throw new Error("Failed to fetch item");
        const data = await res.json();
        setItem({
          purchaseId: data.purchaseId,
          productId: data.productId,
          qty: data.qty,
          costPrice: data.costPrice,
        });
      } catch (err) {
        console.error(err);
        alert("❌ Failed to load purchase item");
      } finally {
        setLoading(false);
      }
    }
    fetchItem();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setItem((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Submit updated purchase item
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      purchaseId: parseInt(item.purchaseId),
      productId: parseInt(item.productId),
      qty: parseInt(item.qty),
      costPrice: parseFloat(item.costPrice),
    };

    try {
      const res = await fetch(`${BASE_URL}/api/purchaseitems/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert("✅ Purchase Item updated successfully");
        navigate("/purchaseitems");
      } else {
        alert("❌ Failed to update purchase item");
      }
    } catch (err) {
      console.error(err);
      alert("❌ Error updating purchase item");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-gray-500 animate-pulse text-lg">Loading item...</p>
      </div>
    );

  return (
    <div className="p-6 flex justify-center items-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Edit Purchase Item
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Purchase ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Purchase ID
            </label>
            <input
              type="number"
              name="purchaseId"
              value={item.purchaseId}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              required
            />
          </div>

          {/* Product ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product ID
            </label>
            <input
              type="number"
              name="productId"
              value={item.productId}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              required
            />
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantity
            </label>
            <input
              type="number"
              name="qty"
              value={item.qty}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              required
            />
          </div>

          {/* Cost Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cost Price
            </label>
            <input
              type="number"
              name="costPrice"
              step="0.01"
              value={item.costPrice}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              required
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-between pt-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow transition"
            >
              Update Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

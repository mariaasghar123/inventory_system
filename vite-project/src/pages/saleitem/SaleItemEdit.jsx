import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function EditSaleItemForm() {
  const { id } = useParams(); // URL se saleItem id
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    saleId: "",
    productId: "",
    qty: "",
    price: "",
    subtotal: "",
  });

  const [loading, setLoading] = useState(true);

  // ✅ Fetch saleItem data from backend on mount
  useEffect(() => {
    async function fetchSaleItem() {
      try {
        const res = await fetch(`${BASE_URL}/api/saleitems/${id}`);
        if (!res.ok) throw new Error("Failed to fetch sale item");
        const data = await res.json();
        setFormData({
          saleId: data.saleId || "",
          productId: data.productId || "",
          qty: data.qty || "",
          price: data.price || "",
          subtotal: data.subtotal || "",
        });
      } catch (err) {
        console.error("Fetch error:", err);
        alert("❌ Failed to fetch sale item data");
      } finally {
        setLoading(false);
      }
    }

    fetchSaleItem();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataToSend = {
      saleId: parseInt(formData.saleId),
      productId: parseInt(formData.productId),
      qty: parseInt(formData.qty),
      price: parseFloat(formData.price),
      subtotal: parseFloat(formData.subtotal),
    };

    try {
      const res = await fetch(`${BASE_URL}/api/saleitems/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });
      if (res.ok) {
        alert("✅ Sale Item Updated!");
        navigate("/saleitems"); // redirect after update
      } else {
        alert("❌ Failed to update Sale Item");
      }
    } catch (err) {
      console.error(err);
      alert("❌ Error updating sale item");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-gray-500 animate-pulse text-lg">
          Loading sale item data...
        </p>
      </div>
    );

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-xl shadow-lg p-8"
      >
        <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">
          Edit Sale Item
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block mb-1 text-gray-600 font-medium">Sale ID</label>
            <input
              name="saleId"
              type="number"
              value={formData.saleId}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-600 font-medium">Product ID</label>
            <input
              name="productId"
              type="number"
              value={formData.productId}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-gray-600 font-medium">Quantity</label>
              <input
                name="qty"
                type="number"
                value={formData.qty}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-gray-600 font-medium">Price</label>
              <input
                name="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 text-gray-600 font-medium">Subtotal</label>
            <input
              name="subtotal"
              type="number"
              step="0.01"
              value={formData.subtotal}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="mt-6 w-full bg-green-600 text-white px-4 py-2.5 rounded-lg shadow hover:bg-green-700 transition-all duration-200 font-semibold"
        >
          Update
        </button>
      </form>
    </div>
  );
}

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; // 🔥 import toast


const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function SaleItemForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    saleId: "",
    productId: "",
    qty: "",
    price: "",
    subtotal: "",
  });

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
      const res = await fetch(`${BASE_URL}/api/saleitems`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      if (res.ok) {
        toast.success("✅ Sale Item Added!", { theme: "colored" }); // ✅ Success toast
        // alert("✅ Sale Item Added!");
        navigate("/salesitem");
        setFormData({
          saleId: "",
          productId: "",
          qty: "",
          price: "",
          subtotal: "",
        });
      } else {
        toast.error("❌ Failed to add Sale Item", { theme: "colored" }); // ❌ Error toast
        // alert("❌ Failed to add Sale Item");
      }
    } catch (err) {
      console.error(err);
      alert("❌ Error adding Sale Item");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-xl shadow-lg p-8"
      >
        <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">
          Add Sale Item
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block mb-1 text-gray-600 font-medium">Sale ID</label>
            <input
              name="saleId"
              type="number"
              value={formData.saleId}
              onChange={handleChange}
              placeholder="Enter Sale ID"
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
              placeholder="Enter Product ID"
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
                placeholder="Qty"
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
                placeholder="Price"
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
              placeholder="Subtotal"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="mt-6 w-full bg-blue-600 text-white px-4 py-2.5 rounded-lg shadow hover:bg-blue-700 transition-all duration-200 font-semibold"
        >
          Save
        </button>
      </form>
    </div>
  );
}

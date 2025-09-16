import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; // 🔥 import toast

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function StockBatchForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    productId: "",
    batch_no: "",
    expiry_date: "",
    qty: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSend = {
      productId: parseInt(formData.productId),
      batch_no: formData.batch_no,
      expiry_date: formData.expiry_date,
      qty: parseInt(formData.qty),
    };

    try {
      const res = await fetch(`${BASE_URL}/api/stockbatches`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      if (res.ok) {
        toast.success("✅ Stock Batch Added!", { theme: "colored" }); // ✅ Success toast
        navigate("/stockbatches");
        setFormData({ productId: "", batch_no: "", expiry_date: "", qty: "" });
      } else {
        const err = await res.json();
        toast.error("❌ Error: " + err.message, { theme: "colored" }); // ❌ Error toast
      }
    } catch (err) {
      console.error("Submit error:", err);
      toast.error("❌ Error submitting stock batch", { theme: "colored" }); // ❌ Error toast
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white shadow-lg rounded-xl border border-gray-200 p-6 space-y-5"
      >
        <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">
          Add Stock Batch
        </h2>

        <input
          name="productId"
          type="number"
          value={formData.productId}
          onChange={handleChange}
          placeholder="Product ID"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          required
        />

        <input
          name="batch_no"
          value={formData.batch_no}
          onChange={handleChange}
          placeholder="Batch No"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          required
        />

        <input
          type="date"
          name="expiry_date"
          value={formData.expiry_date}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          required
        />

        <input
          name="qty"
          type="number"
          value={formData.qty}
          onChange={handleChange}
          placeholder="Quantity"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-md transition duration-200 transform hover:scale-105"
        >
          Save Stock Batch
        </button>
      </form>
    </div>
  );
}

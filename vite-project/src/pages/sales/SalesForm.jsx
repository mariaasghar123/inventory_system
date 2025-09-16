import React, { useState } from "react";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function SaleForm() {
  const [formData, setFormData] = useState({
    invoice_no: "",
    date: "",
    total: "",
    discount: "",
    paymentMethod: "",
    createdBy: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSend = {
      ...formData,
      total: parseFloat(formData.total),
      discount: parseFloat(formData.discount),
      createdBy: parseInt(formData.createdBy),
    };

    try {
      const res = await fetch(`${BASE_URL}/api/sales`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      if (res.ok) {
        alert("✅ Sale Added Successfully!");
        setFormData({
          invoice_no: "",
          date: "",
          total: "",
          discount: "",
          paymentMethod: "",
          createdBy: "",
        });
      } else {
        const err = await res.json();
        alert("❌ Error: " + (err.message || "Failed to add sale"));
      }
    } catch (err) {
      console.error("Error adding sale:", err);
      alert("❌ An error occurred while adding the sale");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-white shadow-lg rounded-xl p-6 space-y-5"
      >
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-4">
          Add New Sale
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="invoice_no"
            value={formData.invoice_no}
            onChange={handleChange}
            placeholder="Invoice No"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <input
            type="number"
            name="total"
            value={formData.total}
            onChange={handleChange}
            placeholder="Total Amount"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            required
          />
          <input
            type="number"
            name="discount"
            value={formData.discount}
            onChange={handleChange}
            placeholder="Discount"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          <select
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
            required
          >
            <option value="">Select Payment Method</option>
            <option value="Cash">Cash</option>
            <option value="Card">Card</option>
            <option value="Bank">Bank</option>
          </select>
          <input
            type="number"
            name="createdBy"
            value={formData.createdBy}
            onChange={handleChange}
            placeholder="User ID (Created By)"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition duration-200"
        >
          💾 Save Sale
        </button>
      </form>
    </div>
  );
}

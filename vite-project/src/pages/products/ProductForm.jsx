import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// ✅ Use environment variable for backend URL
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function ProductForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    sku: "",
    name: "",
    category: "",
    unit: "",
    barcode: "",
    purchase_price: "",
    sale_price: "",
    reorder_level: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Barcode auto generate karne ka function
  const generateBarcode = () => {
    // 12 digit random number
    const randomBarcode = Math.floor(100000000000 + Math.random() * 900000000000).toString();
    setFormData({ ...formData, barcode: randomBarcode });
    toast.info("🔄 Barcode generated: " + randomBarcode, { theme: "colored" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${BASE_URL}/api/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          purchase_price: parseFloat(formData.purchase_price),
          sale_price: parseFloat(formData.sale_price),
          reorder_level: parseInt(formData.reorder_level),
        }),
      });
      if (res.ok) {
        toast.success("✅ Product Added!", { theme: "colored" }); 
        navigate("/products");
      } else {
        const err = await res.json();
        toast.error("❌ Error: " + err.message, { theme: "colored" });
      }
    } catch (err) {
      console.error(err);
      alert("❌ Error adding product.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-2xl rounded-2xl shadow-lg p-8"
      >
        <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">
          ➕ Add New Product
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="sku"
            value={formData.sku}
            onChange={handleChange}
            placeholder="SKU"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />

          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Product Name"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />

          <input
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="Category"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />

          <input
            name="unit"
            value={formData.unit}
            onChange={handleChange}
            placeholder="Unit"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />

          {/* ✅ Barcode field with generate button */}
          <div className="flex gap-2">
            <input
              name="barcode"
              value={formData.barcode}
              onChange={handleChange}
              placeholder="Barcode"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
            <button
              type="button"
              onClick={generateBarcode}
              className="bg-green-500 hover:bg-green-600 text-white px-3 rounded-lg"
            >
              Generate
            </button>
          </div>

          <input
            name="purchase_price"
            type="number"
            value={formData.purchase_price}
            onChange={handleChange}
            placeholder="Purchase Price"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />

          <input
            name="sale_price"
            type="number"
            value={formData.sale_price}
            onChange={handleChange}
            placeholder="Sale Price"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />

          <input
            name="reorder_level"
            type="number"
            value={formData.reorder_level}
            onChange={handleChange}
            placeholder="Reorder Level"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
        >
          💾 Save Product
        </button>
      </form>
    </div>
  );
}

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function EditStockBatch() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    productId: "",
    batch_no: "",
    expiry_date: "",
    qty: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStockBatch = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/stockbatches/${id}`);
        if (!res.ok) throw new Error("Failed to fetch stock batch");
        const data = await res.json();

        setFormData({
          productId: data.productId || "",
          batch_no: data.batch_no || "",
          expiry_date: data.expiry_date
            ? new Date(data.expiry_date).toISOString().split("T")[0]
            : "",
          qty: data.qty || "",
        });

        setLoading(false);
      } catch (err) {
        console.error("Fetch error:", err);
        alert("❌ Error fetching stock batch data");
      }
    };

    fetchStockBatch();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${BASE_URL}/api/stockbatches/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("✅ Stock batch updated successfully");
        navigate("/stockbatches");
      } else {
        alert("❌ Failed to update stock batch");
      }
    } catch (err) {
      console.error("Update error:", err);
      alert("❌ Error updating stock batch");
    }
  };

  if (loading)
    return <p className="text-center mt-10 text-gray-600">Loading...</p>;

  return (
    <div className="p-6 max-w-lg mx-auto min-h-screen flex flex-col justify-center">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
        Edit Stock Batch
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 space-y-5"
      >
        {/* Product ID */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Product ID</label>
          <input
            type="number"
            name="productId"
            value={formData.productId}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
            required
          />
        </div>

        {/* Batch No */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Batch No</label>
          <input
            type="text"
            name="batch_no"
            value={formData.batch_no}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
            required
          />
        </div>

        {/* Expiry Date */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Expiry Date</label>
          <input
            type="date"
            name="expiry_date"
            value={formData.expiry_date}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
            required
          />
        </div>

        {/* Quantity */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Quantity</label>
          <input
            type="number"
            name="qty"
            value={formData.qty}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
            required
          />
        </div>

        {/* Submit button */}
        <button
          type="submit"
          className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg shadow-md transition duration-200 transform hover:scale-105"
        >
          Update Stock Batch
        </button>
      </form>
    </div>
  );
}

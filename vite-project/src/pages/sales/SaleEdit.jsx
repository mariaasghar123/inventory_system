import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function EditSale() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    invoice_no: "",
    date: "",
    total: "",
    discount: "",
    paymentMethod: "",
    user: "",
  });

  // ✅ Fetch existing sale data on mount
  useEffect(() => {
    const fetchSale = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/sales/${id}`);
        const data = await res.json();
        setFormData({
          invoice_no: data.invoice_no || "",
          date: data.date ? data.date.split("T")[0] : "",
          total: data.total || "",
          discount: data.discount || "",
          paymentMethod: data.paymentMethod || "",
          createdBy: data.user || "",
        });
      } catch (err) {
        console.error("Error fetching sale:", err);
        alert("❌ Failed to fetch sale data");
      }
    };
    fetchSale();
  }, [id]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${BASE_URL}/api/sales/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        alert("✅ Sale updated successfully!");
        navigate("/sales");
      } else {
        alert("❌ Update failed");
      }
    } catch (err) {
      console.error("Error updating sale:", err);
      alert("❌ Error updating sale");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-lg p-8 w-full max-w-lg"
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          ✏️ Update Sale
        </h2>

        <div className="space-y-5">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Invoice No</label>
            <input
              name="invoice_no"
              value={formData.invoice_no}
              onChange={handleChange}
              placeholder="Invoice No"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Total</label>
            <input
              name="total"
              type="number"
              value={formData.total}
              onChange={handleChange}
              placeholder="Total"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Discount</label>
            <input
              name="discount"
              type="number"
              value={formData.discount}
              onChange={handleChange}
              placeholder="Discount"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Payment Method</label>
            <input
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              placeholder="Payment Method"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Created By</label>
            <input
              name="createdBy"
              value={formData.createdBy}
              onChange={handleChange}
              placeholder="Created By"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
          </div>
        </div>

        <button
          type="submit"
          className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg shadow-md transition duration-300"
        >
          💾 Update Sale
        </button>
      </form>
    </div>
  );
}

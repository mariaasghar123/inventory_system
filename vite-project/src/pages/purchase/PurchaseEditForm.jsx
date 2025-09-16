import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

// ✅ Use environment variable for backend URL
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function PurchaseEditForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [purchase, setPurchase] = useState({
    invoiceNo: "",
    date: "",
    supplierId: "",
    total: "",
  });
  const [loading, setLoading] = useState(true);

  // ✅ Fetch existing purchase
  useEffect(() => {
    async function fetchPurchase() {
      try {
        const res = await fetch(`${BASE_URL}/api/purchases/${id}`);
        if (!res.ok) throw new Error("Failed to fetch purchase");
        const data = await res.json();

        setPurchase({
          invoiceNo: data.invoiceNo,
          date: data.date.split("T")[0],
          supplierId: data.supplierId,
          total: data.total,
        });
      } catch (err) {
        console.error(err);
        alert("❌ Failed to fetch purchase data");
      } finally {
        setLoading(false);
      }
    }

    fetchPurchase();
  }, [id]);

  // ✅ Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPurchase((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Submit updated data
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${BASE_URL}/api/purchases/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invoiceNo: purchase.invoiceNo,
          date: purchase.date,
          supplierId: parseInt(purchase.supplierId),
          total: parseFloat(purchase.total),
        }),
      });

      if (res.ok) {
        alert("✅ Purchase updated successfully");
        navigate("/purchases");
      } else {
        alert("❌ Failed to update purchase");
      }
    } catch (err) {
      console.error(err);
      alert("❌ Error updating purchase");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <p className="text-gray-500 animate-pulse">Loading purchase data...</p>
      </div>
    );

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-extrabold text-blue-600 mb-6 text-center">
          Edit Purchase
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 text-gray-700 font-semibold">
              Invoice No
            </label>
            <input
              type="text"
              name="invoiceNo"
              value={purchase.invoiceNo}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-700 font-semibold">Date</label>
            <input
              type="date"
              name="date"
              value={purchase.date}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-700 font-semibold">
              Supplier ID
            </label>
            <input
              type="number"
              name="supplierId"
              value={purchase.supplierId}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-700 font-semibold">Total</label>
            <input
              type="number"
              name="total"
              value={purchase.total}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              step="0.01"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2.5 rounded-lg shadow-md hover:from-blue-600 hover:to-blue-700 transform hover:scale-[1.02] transition duration-200 font-semibold"
          >
            Update Purchase
          </button>
        </form>
      </div>
    </div>
  );
}

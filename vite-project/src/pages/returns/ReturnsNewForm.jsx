import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; // 🔥 import toast


const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function ReturnNewForm() {
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);

  const [saleId, setSaleId] = useState("");
  const [productId, setProductId] = useState("");
  const [qty, setQty] = useState("");
  const [reason, setReason] = useState("");
  const [refundAmount, setRefundAmount] = useState("");

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch sales and products
  useEffect(() => {
    async function fetchData() {
      try {
        const [salesRes, productsRes] = await Promise.all([
          fetch(`${BASE_URL}/api/sales`),
          fetch(`${BASE_URL}/api/products`)
        ]);

        if (!salesRes.ok || !productsRes.ok) throw new Error("Failed to fetch data");

        const [salesData, productsData] = await Promise.all([
          salesRes.json(),
          productsRes.json()
        ]);

        setSales(salesData);
        setProducts(productsData);
      } catch (err) {
        console.error(err);
        alert("❌ Failed to load sales or products");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newReturn = {
      saleId: parseInt(saleId),
      productId: parseInt(productId),
      qty: parseInt(qty),
      reason,
      refundAmount: parseFloat(refundAmount),
    };

    try {
      const res = await fetch(`${BASE_URL}/api/returns`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newReturn),
      });

      if (res.ok) {
        toast.success("✅ Return added successfully!", { theme: "colored" }); // ✅ Success toast
        // alert("✅ Return added successfully!");
        navigate("/returns");
      } else {
        toast.error("❌ Failed to add return", { theme: "colored" }); // ❌ Error toast
        // alert("❌ Failed to add return.");
      }
    } catch (err) {
      console.error(err);
      alert("❌ Error adding return");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-gray-500 animate-pulse text-lg">Loading sales and products...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Add New Return
        </h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Sale */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">Sale</label>
            <select
              value={saleId}
              onChange={(e) => setSaleId(e.target.value)}
              className="w-full border-gray-300 focus:ring-2 focus:ring-blue-400 px-4 py-2 rounded-lg shadow-sm"
              required
            >
              <option value="">Select Sale</option>
              {sales.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.invoice_no} (ID: {s.id})
                </option>
              ))}
            </select>
          </div>

          {/* Product */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">Product</label>
            <select
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              className="w-full border-gray-300 focus:ring-2 focus:ring-blue-400 px-4 py-2 rounded-lg shadow-sm"
              required
            >
              <option value="">Select Product</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} (SKU: {p.sku})
                </option>
              ))}
            </select>
          </div>

          {/* Quantity */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">Quantity</label>
            <input
              type="number"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              className="w-full border-gray-300 focus:ring-2 focus:ring-blue-400 px-4 py-2 rounded-lg shadow-sm"
              required
            />
          </div>

          {/* Reason */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">Reason</label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full border-gray-300 focus:ring-2 focus:ring-blue-400 px-4 py-2 rounded-lg shadow-sm"
              required
            />
          </div>

          {/* Refund Amount */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">Refund Amount</label>
            <input
              type="number"
              value={refundAmount}
              onChange={(e) => setRefundAmount(e.target.value)}
              className="w-full border-gray-300 focus:ring-2 focus:ring-blue-400 px-4 py-2 rounded-lg shadow-sm"
              required
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={() => navigate("/returns")}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
            >
              Add Return
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

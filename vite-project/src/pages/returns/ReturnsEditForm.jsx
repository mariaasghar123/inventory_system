import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function ReturnEditForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);

  const [saleId, setSaleId] = useState("");
  const [productId, setProductId] = useState("");
  const [qty, setQty] = useState("");
  const [reason, setReason] = useState("");
  const [refundAmount, setRefundAmount] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch sales, products, and existing return
  useEffect(() => {
    async function fetchData() {
      try {
        const [salesRes, productsRes, returnRes] = await Promise.all([
          fetch(`${BASE_URL}/api/sales`),
          fetch(`${BASE_URL}/api/products`),
          fetch(`${BASE_URL}/api/returns/${id}`),
        ]);

        if (!salesRes.ok || !productsRes.ok || !returnRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const [salesData, productsData, returnData] = await Promise.all([
          salesRes.json(),
          productsRes.json(),
          returnRes.json(),
        ]);

        setSales(salesData);
        setProducts(productsData);
        setSaleId(returnData.saleId);
        setProductId(returnData.productId);
        setQty(returnData.qty);
        setReason(returnData.reason);
        setRefundAmount(returnData.refundAmount);
      } catch (err) {
        console.error(err);
        alert("❌ Failed to load sales, products, or return data");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedReturn = {
      saleId: parseInt(saleId),
      productId: parseInt(productId),
      qty: parseInt(qty),
      reason,
      refundAmount: parseFloat(refundAmount),
    };

    try {
      const res = await fetch(`${BASE_URL}/api/returns/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedReturn),
      });

      if (res.ok) {
        alert("✅ Return updated successfully!");
        navigate("/returns");
      } else {
        alert("❌ Failed to update return.");
      }
    } catch (err) {
      console.error(err);
      alert("❌ Error updating return");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-gray-500 animate-pulse text-lg">
          Loading sales, products, and return data...
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Edit Return
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
              className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition"
            >
              Update Return
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

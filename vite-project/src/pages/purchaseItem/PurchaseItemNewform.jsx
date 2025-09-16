import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function PurchaseItemNewForm() {
  const [purchases, setPurchases] = useState([]);
  const [products, setProducts] = useState([]);
  const [purchaseId, setPurchaseId] = useState("");
  const [productId, setProductId] = useState("");
  const [qty, setQty] = useState("");
  const [costPrice, setCostPrice] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // Fetch purchases and products
  useEffect(() => {
    async function fetchData() {
      try {
        const [pRes, prRes] = await Promise.all([
          fetch(`${BASE_URL}/api/purchases`),
          fetch(`${BASE_URL}/api/products`),
        ]);
        if (!pRes.ok || !prRes.ok) throw new Error("Failed to fetch data");

        const [purchasesData, productsData] = await Promise.all([
          pRes.json(),
          prRes.json(),
        ]);
        setPurchases(purchasesData);
        setProducts(productsData);
      } catch (err) {
        console.error(err);
        alert("❌ Failed to load purchases or products");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newItem = {
      purchaseId: parseInt(purchaseId),
      productId: parseInt(productId),
      qty: parseInt(qty),
      costPrice: parseFloat(costPrice),
    };

    try {
      const res = await fetch(`${BASE_URL}/api/purchaseitems`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItem),
      });

      if (res.ok) {
        alert("✅ Purchase item added successfully!");
        navigate("/purchaseitems");
      } else {
        alert("❌ Failed to add purchase item.");
      }
    } catch (err) {
      console.error(err);
      alert("❌ Error adding purchase item");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-gray-500 animate-pulse text-lg">
          Loading purchases and products...
        </p>
      </div>
    );

  return (
    <div className="p-6 flex justify-center items-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Add New Purchase Item
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Purchase Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Purchase
            </label>
            <select
              value={purchaseId}
              onChange={(e) => setPurchaseId(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            >
              <option value="">-- Select Purchase --</option>
              {purchases.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.invoiceNo}
                </option>
              ))}
            </select>
          </div>

          {/* Product Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Product
            </label>
            <select
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            >
              <option value="">-- Select Product --</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantity
            </label>
            <input
              type="number"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          {/* Cost Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cost Price
            </label>
            <input
              type="number"
              value={costPrice}
              onChange={(e) => setCostPrice(e.target.value)}
              step="0.01"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-between pt-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow transition"
            >
              Add Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function PurchaseForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    supplierId: "",
    date: "",
    invoiceNo: "",
    total: "",
    items: [{ productId: "", qty: "", costPrice: "" }],
  });

  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // ✅ Fetch products for the select dropdown
  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch(`${BASE_URL}/api/products`);
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error(err);
        alert("❌ Failed to load products");
      } finally {
        setLoadingProducts(false);
      }
    }
    fetchProducts();
  }, []);

  // ✅ Handle change in main form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Handle change in purchase items
  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    setFormData((prev) => ({ ...prev, items: newItems }));
  };

  // ✅ Add/remove items dynamically
  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { productId: "", qty: "", costPrice: "" }],
    }));
  };

  const removeItem = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, items: newItems }));
  };

  // ✅ Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    const purchaseData = {
      ...formData,
      supplierId: parseInt(formData.supplierId),
      total: parseFloat(formData.total),
      items: formData.items.map((i) => ({
        productId: parseInt(i.productId),
        qty: parseInt(i.qty),
        costPrice: parseFloat(i.costPrice),
      })),
    };

    try {
      const res = await fetch(`${BASE_URL}/api/purchase`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(purchaseData),
      });

      if (res.ok) {
        alert("✅ Purchase added successfully");
        navigate("/purchase");
      } else {
        alert("❌ Failed to add purchase");
      }
    } catch (err) {
      console.error(err);
      alert("❌ Error submitting purchase");
    }
  };

  if (loadingProducts)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <p className="text-gray-500 animate-pulse text-lg">Loading products...</p>
      </div>
    );

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-extrabold text-blue-600 mb-8 text-center">
          Add New Purchase
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Main Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-1 text-gray-700 font-semibold">Supplier ID</label>
              <input
                type="number"
                name="supplierId"
                value={formData.supplierId}
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
                value={formData.date}
                onChange={handleChange}
                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-gray-700 font-semibold">Invoice No</label>
              <input
                type="text"
                name="invoiceNo"
                value={formData.invoiceNo}
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
                value={formData.total}
                onChange={handleChange}
                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                step="0.01"
                required
              />
            </div>
          </div>

          {/* Purchase Items */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Purchase Items</h2>
            {formData.items.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3 items-center border border-gray-200 p-4 rounded-lg bg-gray-50"
              >
                <select
                  value={item.productId}
                  onChange={(e) => handleItemChange(index, "productId", e.target.value)}
                  className="border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                  required
                >
                  <option value="">Select Product</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  placeholder="Qty"
                  value={item.qty}
                  onChange={(e) => handleItemChange(index, "qty", e.target.value)}
                  className="border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                  required
                />

                <input
                  type="number"
                  placeholder="Cost Price"
                  value={item.costPrice}
                  onChange={(e) => handleItemChange(index, "costPrice", e.target.value)}
                  className="border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                  required
                />

                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="text-red-500 hover:text-red-600 font-bold text-lg"
                >
                  &times;
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={addItem}
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:from-blue-600 hover:to-blue-700 transform hover:scale-[1.02] transition duration-200 font-semibold"
            >
              + Add Item
            </button>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg shadow-md hover:from-green-600 hover:to-green-700 transform hover:scale-[1.02] transition duration-200 font-semibold"
            >
              Add Purchase
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

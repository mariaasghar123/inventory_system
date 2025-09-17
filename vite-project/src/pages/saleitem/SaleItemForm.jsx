import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function SaleItemForm() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);

  const [formData, setFormData] = useState({
    saleId: "",
    productId: "",
    qty: 1,
    price: "",
    subtotal: "",
  });

  // ✅ Fetch all products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/products`);
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error(err);
        toast.error("❌ Error fetching products");
      }
    };
    fetchProducts();
  }, []);

  // ✅ Fetch all sales
  useEffect(() => {
    const fetchSales = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/sales`);
        if (!res.ok) throw new Error("Failed to fetch sales");
        const data = await res.json();
        setSales(data);
      } catch (err) {
        console.error(err);
        toast.error("❌ Error fetching sales");
      }
    };
    fetchSales();
  }, []);

  // ✅ Auto-update price & subtotal
  useEffect(() => {
    if (formData.productId && products.length > 0) {
      const product = products.find(
        (p) => p.id === parseInt(formData.productId)
      );
      if (product) {
        const price = product.sale_price || 0;
        const subtotal = price * formData.qty;
        setFormData((prev) => ({
          ...prev,
          price: price,
          subtotal: subtotal,
        }));
      }
    }
  }, [formData.productId, formData.qty, products]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // ✅ Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataToSend = {
      saleId: parseInt(formData.saleId),
      productId: parseInt(formData.productId),
      qty: parseInt(formData.qty),
      price: parseFloat(formData.price),
      subtotal: parseFloat(formData.subtotal),
    };

    // ✅ Low stock alert (frontend validation)
    const selectedProduct = products.find(
      (p) => p.id === parseInt(formData.productId)
    );
    if (selectedProduct && selectedProduct.current_stock < dataToSend.qty) {
      toast.error("❌ Not enough stock available");
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/api/saleitems`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      if (res.ok) {
        toast.success("✅ Sale Item Added!", { theme: "colored" });
        navigate("/salesitem");
        setFormData({
          saleId: "",
          productId: "",
          qty: 1,
          price: "",
          subtotal: "",
        });
      } else {
        const errData = await res.json();
        toast.error(`❌ Failed: ${errData.error || "Unknown error"}`);
      }
    } catch (err) {
      console.error(err);
      toast.error("❌ Error adding Sale Item", { theme: "colored" });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-xl shadow-lg p-8"
      >
        <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">
          Add Sale Item
        </h2>

        <div className="space-y-4">
          {/* ✅ Sale ID Dropdown */}
          <div>
            <label className="block mb-1 text-gray-600 font-medium">
              Sale
            </label>
            <select
              name="saleId"
              value={formData.saleId}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Sale</option>
              {sales.map((s) => (
                <option key={s.id} value={s.id}>
                  Sale #{s.id} —{" "}
                  {s.customer_name || s.invoice_no || "No Customer"}
                </option>
              ))}
            </select>
          </div>

          {/* ✅ Product Dropdown */}
          <div>
            <label className="block mb-1 text-gray-600 font-medium">
              Product
            </label>
            <select
              name="productId"
              value={formData.productId}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Product</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} — (Barcode: {p.barcode})
                </option>
              ))}
            </select>
          </div>

          {/* ✅ Qty and Price */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-gray-600 font-medium">
                Quantity
              </label>
              <input
                name="qty"
                type="number"
                value={formData.qty}
                onChange={handleChange}
                placeholder="Qty"
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-gray-600 font-medium">
                Price
              </label>
              <input
                name="price"
                type="number"
                step="0.01"
                value={formData.price}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
              />
            </div>
          </div>

          {/* ✅ Subtotal */}
          <div>
            <label className="block mb-1 text-gray-600 font-medium">
              Subtotal
            </label>
            <input
              name="subtotal"
              type="number"
              step="0.01"
              value={formData.subtotal}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
            />
          </div>
        </div>

        <button
          type="submit"
          className="mt-6 w-full bg-blue-600 text-white px-4 py-2.5 rounded-lg shadow hover:bg-blue-700 transition-all duration-200 font-semibold"
        >
          Save
        </button>
      </form>
    </div>
  );
}

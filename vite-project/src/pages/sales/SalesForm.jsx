import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function SaleForm() {
  const [barcode, setBarcode] = useState(""); // barcode input
  const [products, setProducts] = useState([]); // added products in cart
  const [users, setUsers] = useState([]); // 🟩 all users for dropdown

  const [formData, setFormData] = useState({
    invoice_no: "",
    date: "",
    discount: 0,
    paymentMethod: "",
    createdBy: "",
  });

  // 🟩 Auto generate invoice_no & date once on mount + fetch users
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const randomInvoice = "INV-" + Math.floor(100000 + Math.random() * 900000);
    setFormData((prev) => ({
      ...prev,
      date: today,
      invoice_no: randomInvoice,
    }));

    // fetch users from backend
    fetch(`${BASE_URL}/api/users`) // 👈 aapke backend ka route users ka
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error("Error fetching users:", err));
  }, []);

  // 🟩 handle change for main form
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🟩 Fetch product by barcode
  const handleAddProduct = async () => {
    if (!barcode) return;

    try {
      const res = await fetch(`${BASE_URL}/api/products/barcode/${barcode}`);
      if (!res.ok) {
        toast.error("❌ Product not found!");
        return;
      }
      const product = await res.json();

      // add product with default qty 1
      setProducts((prev) => [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          price: product.sale_price,
          qty: 1,
          subtotal: product.sale_price,
        },
      ]);
      setBarcode("");
    } catch (err) {
      console.error(err);
      toast.error("Error fetching product");
    }
  };

  // 🟩 Update qty
  const handleQtyChange = (index, qty) => {
    const updated = [...products];
    updated[index].qty = qty;
    updated[index].subtotal = qty * updated[index].price;
    setProducts(updated);
  };

  // 🟩 Calculate totals
  const subtotal = products.reduce((acc, p) => acc + p.subtotal, 0);
  const discountAmt = parseFloat(formData.discount || 0);
  const total = subtotal - discountAmt;

  // 🟩 Submit sale
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (products.length === 0) {
      toast.error("Please add products first!");
      return;
    }

    const dataToSend = {
      ...formData,
      total,
      discount: discountAmt,
      items: products.map((p) => ({
        productId: p.productId,
        qty: p.qty,
        price: p.price,
        subtotal: p.subtotal,
      })),
    };

    try {
      const res = await fetch(`${BASE_URL}/api/sales`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      if (res.ok) {
        toast.success("✅ Sale Created!");
        // reset form but keep date & invoice auto generated
        const today = new Date().toISOString().split("T")[0];
        const randomInvoice =
          "INV-" + Math.floor(100000 + Math.random() * 900000);
        setFormData({
          invoice_no: randomInvoice,
          date: today,
          discount: 0,
          paymentMethod: "",
          createdBy: "",
        });
        setProducts([]);
      } else {
        toast.error("❌ Failed to create sale");
      }
    } catch (err) {
      console.error(err);
      toast.error("❌ Error creating sale");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <form
        onSubmit={handleSubmit}
        className="max-w-4xl mx-auto bg-white shadow rounded-xl p-6 space-y-5"
      >
        <h2 className="text-3xl font-bold text-gray-800 text-center">
          🛒 New Sale
        </h2>

        {/* 🔹 Invoice / date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="invoice_no"
            value={formData.invoice_no}
            onChange={handleChange}
            placeholder="Invoice No"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
            required
          />
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        {/* 🔹 Barcode scan */}
        <div className="flex gap-2">
          <input
            type="text"
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddProduct();
              }
            }}
            placeholder="Scan / Enter Barcode"
            autoFocus
            className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-green-400"
          />
          <button
            type="button"
            onClick={handleAddProduct}
            className="bg-green-600 text-white px-4 rounded-lg hover:bg-green-700"
          >
            Add
          </button>
        </div>

        {/* 🔹 Cart Table */}
        {products.length > 0 && (
          <table className="w-full text-sm border mt-4">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Product</th>
                <th className="p-2 border">Price</th>
                <th className="p-2 border">Qty</th>
                <th className="p-2 border">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p, i) => (
                <tr key={i}>
                  <td className="p-2 border">{p.name}</td>
                  <td className="p-2 border">{p.price}</td>
                  <td className="p-2 border">
                    <input
                      type="number"
                      value={p.qty}
                      onChange={(e) =>
                        handleQtyChange(i, parseInt(e.target.value))
                      }
                      className="w-16 p-1 border rounded"
                    />
                  </td>
                  <td className="p-2 border">{p.subtotal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* 🔹 Discount & Payment */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Discount
            </label>
            <input
              type="number"
              name="discount"
              value={formData.discount}
              onChange={handleChange}
              placeholder="Discount"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-400"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Payment Method
            </label>
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-400"
              required
            >
              <option value="">Select Payment Method</option>
              <option value="Cash">Cash</option>
              <option value="Easypaisa">Easypaisa</option>
              <option value="JazzCash">JazzCash</option>
              <option value="Card">Card</option>
            </select>
          </div>
        </div>

        {/* 🔹 Created By (dropdown) */}
        <div className="mt-4">
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Created By (User)
          </label>
          <select
            name="createdBy"
            value={formData.createdBy}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-gray-400"
            required
          >
            <option value="">Select User</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>

        {/* 🔹 Totals */}
        <div className="text-right text-lg font-semibold mt-4">
          Subtotal: {subtotal} <br />
          Discount: {discountAmt} <br />
          Total: {total}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition duration-200 mt-4"
        >
          💾 Save Sale
        </button>
      </form>
    </div>
  );
}

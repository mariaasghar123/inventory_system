import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

// Use BASE_URL from environment variable
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    unit: "",
    sale_price: "",
    purchase_price: "",
    barcode: "",
    reorder_level: ""
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/products/${id}`);
        if (!res.ok) throw new Error("Failed to fetch product");
        const data = await res.json();
        setFormData(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        alert("Error fetching product data");
      }
    };
    fetchProduct();
  }, [id]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${BASE_URL}/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("Product updated successfully!");
        navigate("/products");
      } else {
        alert("Update failed");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating product");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-0 to-blue-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-lg p-8 w-full max-w-lg"
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          ✏️ Update Product
        </h2>

        <div className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Name</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Product Name"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Category</label>
            <input
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="Category"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Unit */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Unit</label>
            <input
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              placeholder="Unit (e.g. pcs)"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Sale Price */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Sale Price</label>
            <input
              name="sale_price"
              value={formData.sale_price}
              onChange={handleChange}
              placeholder="Sale Price"
              type="number"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Purchase Price */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Purchase Price
            </label>
            <input
              name="purchase_price"
              value={formData.purchase_price}
              onChange={handleChange}
              placeholder="Purchase Price"
              type="number"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Barcode */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Barcode</label>
            <input
              name="barcode"
              value={formData.barcode}
              onChange={handleChange}
              placeholder="Barcode"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Reorder Level */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Reorder Level
            </label>
            <input
              name="reorder_level"
              value={formData.reorder_level}
              onChange={handleChange}
              placeholder="Reorder Level"
              type="number"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>

        <button
          type="submit"
          className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg shadow-md transition duration-300"
        >
          💾 Update Product
        </button>
      </form>
    </div>
  );
}

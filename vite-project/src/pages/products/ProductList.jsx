import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
export default function ProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/products`);
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      // Delete product
const res = await fetch(`${BASE_URL}/api/products/${id}`, { method: "DELETE" });
      // const res = await fetch(`http://localhost:5000/api/products/${id}`, {
        
      if (res.ok) {
        setProducts(products.filter((p) => p.id !== id));
        alert("Product deleted successfully!");
      } else {
        alert("Failed to delete product.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      {/* Heading + Add Button */}
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 space-y-3 md:space-y-0">
        <h1 className="text-3xl font-bold text-gray-800">📦 Products</h1>
        <Link
          to="/products/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow-md transition-all duration-200"
        >
          + Add New Product
        </Link>
      </div>

      {/* Table container */}
      <div className="overflow-x-auto rounded-lg shadow-lg">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gradient-to-r from-blue-50 to-blue-100 text-gray-700 uppercase text-sm">
            <tr>
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">Category</th>
              <th className="py-3 px-4 text-left">Unit</th>
              <th className="py-3 px-4 text-left">Sale Price</th>
              <th className="py-3 px-4 text-left">Purchase Price</th>
              <th className="py-3 px-4 text-left">Barcode</th>
              <th className="py-3 px-4 text-left">Reorder Level</th>
              <th className="py-3 px-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 divide-y divide-gray-200">
            {products.map((p, idx) => (
              <tr
                key={p.id}
                className={`hover:bg-blue-50 transition-all duration-200 ${
                  idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                }`}
              >
                <td className="py-3 px-4">{p.name}</td>
                <td className="py-3 px-4">{p.category}</td>
                <td className="py-3 px-4">{p.unit}</td>
                <td className="py-3 px-4 font-medium text-green-600">{p.sale_price}</td>
                <td className="py-3 px-4 text-red-600">{p.purchase_price}</td>
                <td className="py-3 px-4">{p.barcode}</td>
                <td className="py-3 px-4">{p.reorder_level}</td>
                <td className="py-3 px-4 text-center space-x-3">
                  {/* Edit button */}
                  <Link
                    to={`/products/edit/${p.id}`}
                    className="inline-flex items-center text-green-600 hover:text-green-800 transition-colors duration-200"
                    title="Edit"
                  >
                    <FaEdit size={18} />
                  </Link>

                  {/* Delete button */}
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="inline-flex items-center text-red-600 hover:text-red-800 transition-colors duration-200"
                    title="Delete"
                  >
                    <FaTrash size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

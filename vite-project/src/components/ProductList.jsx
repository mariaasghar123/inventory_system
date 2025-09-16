import React, { useEffect, useState } from "react";

const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.map((product) => (
          <div key={product.id} className="p-4 border rounded shadow">
            <h2 className="text-xl font-semibold">{product.name}</h2>
            <p>SKU: {product.sku}</p>
            <p>Category: {product.category}</p>
            <p>Price: ${product.sale_price}</p>
            <p>Reorder Level: {product.reorder_level}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;

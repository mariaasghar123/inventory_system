import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white p-4 flex gap-4">
      <Link to="/products" className="hover:underline">Products</Link>
      <Link to="/users" className="hover:underline">Users</Link>
      <Link to="/sales" className="hover:underline">Sales</Link>
      <Link to="/salesitem" className="hover:underline">Sale Items</Link>
      <Link to="/stockbatches" className="hover:underline">Stock Batches</Link>
      <Link to="/expenses" className="hover:underline">Expenses</Link>
      <Link to="/purchase" className="hover:underline">Purchases</Link>
      <Link to="/purchaseitems" className="hover:underline">Purchase Items</Link>
      <Link to="/returns" className="hover:underline">Returns</Link>
    </nav>
  );
}
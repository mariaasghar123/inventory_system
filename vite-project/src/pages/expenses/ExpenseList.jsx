import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Use environment variable for backend URL
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function ExpenseList() {
  const [expenses, setExpenses] = useState([]);
  const navigate = useNavigate();

  // ✅ Fetch expenses from backend
  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/expenses`);
      if (!res.ok) throw new Error("Failed to fetch expenses");
      const data = await res.json();
      setExpenses(data);
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Delete expense
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this expense?")) return;

    try {
      const res = await fetch(`${BASE_URL}/api/expenses/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setExpenses(expenses.filter((e) => e.id !== id));
        alert("Expense deleted successfully!");
      } else {
        alert("Failed to delete expense.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Navigate to edit expense form
  const handleEdit = (id) => {
    navigate(`/expenses/${id}/edit`);
  };

  // ✅ Navigate to add new expense form
  const handleNewExpense = () => {
    navigate("/expenses/new");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Heading + Add button */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
          <h1 className="text-3xl font-extrabold text-gray-800 mb-4 md:mb-0">
            💰 Expenses
          </h1>
          <button
            onClick={handleNewExpense}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-lg shadow transition duration-200"
          >
            + New Expense
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto bg-white rounded-2xl shadow-lg">
          <table className="w-full text-left border-collapse">
            <thead className="bg-yellow-100">
              <tr>
                <th className="px-6 py-3 text-sm font-semibold text-gray-600 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-sm font-semibold text-gray-600 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-sm font-semibold text-gray-600 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-sm font-semibold text-gray-600 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-sm font-semibold text-gray-600 uppercase tracking-wider">
                  Reminder Date
                </th>
                <th className="px-6 py-3 text-sm font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {expenses.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No expenses found
                  </td>
                </tr>
              ) : (
                expenses.map((e, index) => (
                  <tr
                    key={e.id}
                    className={`hover:bg-gray-50 ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <td className="px-6 py-4">{e.category}</td>
                    <td className="px-6 py-4 font-semibold text-green-600">
                      Rs. {e.amount}
                    </td>
                    <td className="px-6 py-4">
                      {new Date(e.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">{e.description}</td>
                    <td className="px-6 py-4">
                      {e.reminderDate
                        ? new Date(e.reminderDate).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="px-6 py-4 flex space-x-2">
                      <button
                        onClick={() => handleEdit(e.id)}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded-lg transition duration-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(e.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-lg transition duration-200"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
